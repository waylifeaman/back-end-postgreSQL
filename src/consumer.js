require('dotenv').config();

const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const pool = require('./config/database');

const {QUEUE_NAME} = require('./utils/rabbitmq');

const transporter  = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: Number(process.env.MAIL_PORT) === 465,
        auth:{
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
});

const getApplicationDetail = async (applicationId) => {
    const {rows} = await pool.query(
        `SELECT a.id,
            a.created_at ,
            applicant.name  AS applicant_name,
            applicant.email AS applicant_email,
            owner.email     AS owner_email,
            j.title         AS job_title
        FROM applications a 
        JOIN users applicant    ON applicant.id = a.user_id
        JOIN jobs j             ON j.id = a.job_id
        JOIN users owner        ON owner.id = j.posted_by
        WHERE a.id = $1`, [applicationId],
    );
    return rows[0];
}

const handleMessage = async (channel, msg) => {
    if(!msg) return;

    try{
        console.log('Isi pesan:', msg.content.toString());
        const {application_id: applicationId} = JSON.parse(msg.content.toString());
        const detail = await getApplicationDetail(applicationId);
        if(!detail){
            console.error(`Lamaran ${applicationId} tidak ditemukan`);
            return channel.ack(msg);
        }
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: detail.owner_email,
            subject: `Lamaran baru untuk Lowongan ${detail.job_title}`,
            text: [
                'Ada kandidat baru yang melamar untuk lowongan Anda.',
                `Nama Pelamar: ${detail.applicant_name}`,
                `Email Pelamar: ${detail.applicant_email}`,
                `Tanggal Melamar: ${detail.created_at}`,
            ].join('\n'),
        });
        console.log(`Email notifikasi lamaran ${applicationId} berhasil dikirim ke ${detail.owner_email}`);
        return channel.ack(msg);
    }catch(err){
        console.error('Gagal memproses pesan:', err.message);
        return channel.nack(msg, false, true);
    }
}
const start = async()=>{
    const connection = await amqp.connect({
        hostname: process.env.RABBITMQ_HOST,
        port: Number(process.env.RABBITMQ_PORT) || 5672,
        username: process.env.RABBITMQ_USER,
        password: process.env.RABBITMQ_PASSWORD,
    })
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, {durable: true});
    channel.prefetch(1);

    console.log('Consumer Berjalan, menunggu pesan...');
    channel.consume(QUEUE_NAME, (msg) => handleMessage(channel, msg));
}
console.log('RabbitMQ user:', process.env.RABBITMQ_USER, 'host:', process.env.RABBITMQ_HOST);
start().catch((err) => {
    console.error('Gagal memulai consumer:', err);
    process.exit(1);
})

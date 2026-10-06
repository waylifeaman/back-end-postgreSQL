const amqp = require('amqplib');

const QUEUE_NAME = 'applications_queue';

let channelPromise = null;

// koneksi ke rabbitmq
const getChanel = ()=>{
    if(!channelPromise){
        channelPromise = (async () => {
            const connection = await amqp.connect({
                hostname: process.env.RABBITMQ_HOST || 'localhost',
                port: Number(process.env.RABBITMQ_PORT) || 5672,
                username: process.env.RABBITMQ_USER || 'guest',
                password: process.env.RABBITMQ_PASSWORD || 'guest',
            });
            const channel = await connection.createChannel();
            await channel.assertQueue(QUEUE_NAME, {durable: true});
            return channel;
        })();
        channelPromise.catch(()=>{
            channelPromise = null;
        })
    }
    return channelPromise;
}


//payload
const publishApplications = async (applicationId)=>{
    const channel = await getChanel();
    channel.sendToQueue(
        QUEUE_NAME,
        Buffer.from(JSON.stringify({application_id:applicationId})),
        {persistent: true}
    )
}
module.exports = {QUEUE_NAME ,publishApplications};
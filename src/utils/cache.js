const {createClient} = require('redis');

const TTL_SECONDS = 3600; // 1 jam
const client = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    }
})

client.on('error',(err)=> console.error('Redis error:', err.message));
client.connect().catch((err)=>console.error('Redis connection error:', err.message));

const get = async (key) => {
    try{
        const value = await client.get(key);
        return value ? JSON.parse(value) : null;
    }catch(err){
        return null;
    }
};

const set = async (key, value)=>{
    try{
        await client.set(key, JSON.stringify(value), {
            EX: TTL_SECONDS,
        });
    }catch(err){
        console.error('Redis set gagal:', err.message);
    }
};

const del = async(...keys)=>{
    try{
        if(keys.length ){
            await client.del(keys);
        }
    }catch(err){
        console.error('Redis del gagal:', err.message);
    }
}

module.exports = {
    get,
    set,
    del,
};
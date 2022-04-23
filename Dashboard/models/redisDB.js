const db = require('./connectRedis');

// DB keys
const keys = ["join", "service", "complaint", "leave", "waiting"];
// data expiration time 
const todayEnd = new Date().setHours(23, 59, 59, 999);

const redisDB = {

    setExpiresTime: function (key) {
        // sets an expiration date for the data 
        db.expireat(key, parseInt(todayEnd / 1000));
    },
    initDB: async function() {
        keys.forEach(key => {
            db.set(key, 0);
        });
        console.log('initDB');
    },
    setExpiresTimeForAllKeys: function () {
        keys.forEach(key => {
            this.setExpiresTime(key);
        });
        console.log('setExpiresTimeForAllKeys');
    },
    incrementByOne: async function(key){
        try {
            // gets the data
            let value = await db.get(key);
            console.log("current num: " + value);
        
            // increments and stores the updated data in the database
            await db.set(key, ++value);
            console.log(`updated ${key} number: ${value}`);

            // sets an expiration date for the data 
            this.setExpiresTime(key);
            console.log('set an expiration date'); 
        
        } catch (error) {
            console.log(error);
        }
    },
    decrementByOne: async function(key) {
        try {
            // gets the data
            let value = await db.get(key);
            console.log("current num: " + value);
        
            // increments and stores the updated data in the database
            if (value > 0) {
                await db.set(key, --value);
            } else {
              console.log("value can not be negative");
            }
            console.log(`updated ${key} number: ${value}`);
            // sets an expiration date for the data 
            this.setExpiresTime(key);   
            console.log('set an expiration date'); 
        
          } catch (error) {
            console.log(error);
          }
    },
    setTopic: async function(topic) {
        // we can refactor this
        switch(topic) {
            case 'join':
                await this.incrementByOne('join');
                break;
            case 'service':
                await this.incrementByOne('service');
                break;
            case 'complaint':
                await this.incrementByOne('complaint');
                break;
            case 'leave':
                await this.incrementByOne('leave');
                break;
            case 'TotalWaiting':
                await this.incrementByOne('waiting');
                break;
            case 'decrementTotalWaiting':
                await this.decrementByOne('waiting');
                break;
            default:
                console.log('invalid topic');
                break;
            }
    },
    getAllData: async function() {
        let allData = [];
        allData.push(await db.get('join'));
        allData.push(await db.get('service'));
        allData.push(await db.get('complaint'));
        allData.push(await db.get('leave'));
        allData.push(await db.get('waiting'));

        return allData;
    }
}

module.exports = redisDB;
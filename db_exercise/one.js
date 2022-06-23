const path = require("path")
const {readFileSync} = require("fs")
const {promisify} = require("util");
const {Database} = require("sqlite3")

const DB_PATH = path.join(__dirname,"my.db");
const DB_SQL_PATH = path.resolve(__dirname, "../mydb.sql");
const initSql = readFileSync(DB_SQL_PATH, "utf-8");

let SQL3;

async function main(){
  
  const myDB = new Database(DB_PATH);

  SQL3 = {
    run(...args){
      return new Promise((res, rej) => {
        myDB.run(...args, function (err) {
          if(err) rej(err);
          else res(this)
        })
      })
    },
    get: promisify(myDB.get.bind(myDB)),
    all: promisify(myDB.all.bind(myDB)),
    exec: promisify(myDB.exec.bind(myDB))
  }


  await SQL3.exec(initSql)

}

main()



const getBonkByInfo = async (info) => {
  
  const result = await SQL3.get(/* sql */`
    SELECT * FROM Bonk WHERE info = ?
  `,
  info)

  return result
}


const insertBonk = async (info) => {

  return SQL3.run(/* sql */`
    INSERT INTO Bonk (info) VALUES (?) 
  `,
  info
  )

}

// OK, WE CAN DEFINE NEW METHODS
// BUT LETS DEFINE THAT WE GET BY REFERENCE RECORD
// AND LETS GET IT BY REFERENCE REC VALUE
// SO WE NEED TO DO A LEFT JOIN
const getShibaByBonkInfo = async (bonkInfo) => {
  
  return SQL3.get(/* sql */`
    SELECT * FROM Shiba
    LEFT JOIN Bonk 
    ON Shiba.bonkId = Bonk.id
    WHERE Bonk.info = ?
  `,
  bonkInfo)

}

// NOW THE INSERTION METHOD
// WE WILL SET A REFERENCE HERE
const insertShiba = async (info, bonkId) => {

  return SQL3.run(/* sql */`
    INSERT INTO Shiba (info, bonkId) VALUES (?, ?)
  `, info, bonkId)
}



getBonkByInfo("foobar")
  .then( async record => {

    console.log({record})

    await insertBonk("Shibetoshi Nakato")

    const rec1 = await getBonkByInfo("Suzuki Nakamoto")

    console.log({rec1})

    const rec2 = await getBonkByInfo("Shibetoshi Nakato")

    console.log({rec2})


    // LETS CONTINUE HERE SINCE THIS ASYNC FUNCTION IS CONVINIENT
    // TO TEST THINGS OUT
    await insertShiba("Hello World", 1)

    // LETS GET WHAT WE INSERTED
    const rec3 = await getShibaByBonkInfo("Shibetoshi Nakato")

    // THIS SHOULD BE OUR RECORD THAT WE FOUND THROUGH
    // OTHER RECORD THAT IS REFERENCE
    console.log({rec3})





  })




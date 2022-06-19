#!/usr/bin/env node
"use strict"

// WE NEED ALSO A createWriteStream
const {createReadStream, createWriteStream} = require("fs")
const path = require("path")

const {Transform} = require("stream")

const minimist = require("minimist");


// WE WILL CREATE WRITE STREAM
// IN HERE WE DEFINE A PATH WHERE STREAM WILL OUTPUT ITS DATA
const myWriteStream = createWriteStream("_exercise_2/some_file.txt")

const transToUpperCase = new Transform({

  transform(chunkBuff, chunkEnc, next) {
    
  
    this.push(chunkBuff.toString().toUpperCase())

    next()

  }
})


const args = minimist(process.argv.slice(2), {
  boolean: ["help"],
  string: ["file"]
})


if(args["help"]){
  return printHelp()
}

if(!args["file"]){
  return printError("You must provide file path", true)
}


const filePath = path.resolve(args["file"])


const neuReadStream = createReadStream(filePath)

neuReadStream.on("error", (err) => {

  printError(err.message)
})


// INSTEAD OF PIPING INTO STANDAR OUT
// PIPE TO THE WRITABLE STREM WE SETTED FOR A FILE
neuReadStream.pipe(transToUpperCase).pipe(myWriteStream);

// *****************************************

function printHelp(){
  console.log(`
          foobar --help

  --help          getting help
  --file          specify file path (string)
  `)
}

function printError(msg, includeHelp = false){

  console.error(msg)

  if(includeHelp){
    printHelp()
  }
}
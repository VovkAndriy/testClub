const fs = require('fs')
const axios = require('axios')
const dotenv = require('dotenv');
dotenv.config()


let fileName;
let ids = [];

for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "-o") {
        if (!process.argv[i+1])
            throw new Error("the file name or list of ids is/are not specified")
        fileName = `${process.argv[i+1]}.json`;
    }
    if (process.argv[i] === "-p") {
        if (!process.argv[i+1])
            throw new Error("the file name or list of ids is/are not specified")
        ids = process.argv[i+1].split(',');
    }
}
if (!fileName || ids.length === 0)
    throw new Error("the file name or list of ids is/are not specified")

const getProjects = async () => {
    const res = await Promise.all(ids.map(id => axios.get(`https://api.clubhouse.io/api/v3/projects/${id}`, {
        headers: {'Clubhouse-Token': process.env.CLUBHOUSE_API_TOKEN}
    }).then(response => {
        // console.log(response)
        const {id, name, description} = response.data;
        return {id, name, description};
        })
    ));
    return res;
}
getProjects()
    .then((data) => {
        fs.writeFile(fileName, JSON.stringify(data), (err) => {
            if (err)
                throw err
        });
    })




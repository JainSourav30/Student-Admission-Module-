import Applicant from './classes/Applicant.mjs'
import Branch from './classes/Branch.mjs'
import Preference from './classes/Preference.mjs'
import pool from './database'

//const pool = require('./database')


const getwait = (pref) => {
    let str = pref.slice(5,pref.length - 1)
    let b = parseInt(str)
    return b
}

const getstring = (pref) => {
    return pref.slice(1,4)
}

const applicants = []
const branches = []


const retrieveData = async() => {

    //Applicants
    const details = await pool.query("SELECT id, percentile, status, on_hold FROM applicants;")
    for(let a = 0; a < details.rowCount; ++a){
        const pref_details = await pool.query("SELECT UNNEST(prefs) FROM applicants WHERE id = ($1);",[a+1])
        let pref_array = []
        for(let i=0; i < pref_details.rowCount; ++i){
            pref_array.push(new Preference(getstring(pref_details.rows[i].unnest),getwait(pref_details.rows[i].unnest)))
        }
        let p = new Applicant(details.rows[a].id,details.rows[a].percentile,pref_array,details.rows[a].status,details.rows[a].on_hold)
        applicants.push(p)
    }
    
    //Branches
    const b_details = await pool.query("SELECT * FROM branches;")
    for(let b = 0; b < b_details.rowCount ; ++b){
        branches.push(new Branch(b_details.rows[b].id,b_details.rows[b].seats,b_details.rows[b].status,b_details.rows[b].wl_no))
    }
}

retrieveData()


console.log(applicants)

module.exports = {applicants, branches}

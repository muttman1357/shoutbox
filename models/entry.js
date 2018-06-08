const db = require('../database/connection');

class Entry {
  constructor(obj) {
    for(let key in obj) {
      this[key] = obj[key];
    }
  }

  save(cb) {
    const title = this.title;
    const body = this.body;

    db.query('INSERT INTO nodia_posts(title, body) values(?,?)', [title, body], (err, results, fields) => {
      if(err) throw err;
      cb();
    });
  }

  static getRange(from, to, cb) {
    db.query('SELECT * FROM nodia_posts WHERE id BETWEEN ? AND ?', [from, to], (err, results, fields) => {
      if(err) throw err;
      cb(results);
    });
  }
}

module.exports = Entry;
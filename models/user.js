const db = require('../database/connection');
const bcrypt = require('bcrypt');

class User {
  constructor(obj) {
    for(let key in obj) {
      this[key] = obj[key];
    }
  }

  static authenticate(name, pass, cb) {
    User.getByName(name, (err, user) => {
      if(err) return cb(err);
      if(!user || !user.id) return cb();
      bcrypt.hash(pass, user.salt, (err,hash) => {
        if(err) return cb(err);
        if(hash === user.pass) return cb(null, user);
        cb();
      });
    });
  }

  static getByName(name, cb) {
    User.getId(name, (err, user) => {
      if(err) return cb(err);
      if(Object.keys(user).length === 0) {
        return cb(null, {});
      }
      return cb(null, user);
    });
  }

  static getId(name, cb) {
    db.query('SELECT * FROM nodia_users WHERE username=?', [name], (err, results, fields) => {
      if(err) return cb(err);
      cb(null, new User(results[0]));
    });
  }

  static get(id, cb) {
    db.query('SELECT id, username FROM nodia_users WHERE id=?', [id], (err, results, fields) => {
      if(err) return cb(err);
      cb(null, new User(results[0]));
    });
  }

  checkForUser(username, cb) {
    console.log(username);
    db.query('SELECT username FROM nodia_users WHERE username=?', [username], (err, results, fields) => {
      if(err) return cb(err);

      if(results.length === 0) {
        return cb(err);
      }

      let res = results[0].username || '';
      cb(err, res);
    });
  }

  save(cb) {
    this.checkForUser(this.name, (err, results) => {
      if(err) return cb(err);
      // this.name = results;

      if(typeof results !== 'undefined') {
        // this.update(cb);
        console.log(`${this.name} already in database`);
      }
      else {
        this.hashPassword((err) => {
          if(err) return cb(err);
          this.update(cb);
        });
      }
    });
  }

  update(cb) {
    const username = this.name;
    const pass = this.pass;
    const salt = this.salt;
    db.query('INSERT INTO nodia_users(username, pass, salt) values(?,?,?)', [username, pass, salt], (err, results, fields) => {
      if(err) return cb(err);
      cb();
    });
  }

  hashPassword(cb) {
    bcrypt.genSalt(12, (err, salt) => {
      if(err) return cb(err);
      this.salt = salt;
      bcrypt.hash(this.pass, salt, (err, hash) => {
        if(err) return cb(err);
        this.pass = hash;
        cb();
      })
    });
  }

}

module.exports = User;
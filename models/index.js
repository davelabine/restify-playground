'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};
const CONFIG = require('../config/config');

const sequelize = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password, {
  host: CONFIG.db_host,
  dialect: CONFIG.db_dialect,
  port: CONFIG.db_port,
  operatorsAliases: false
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

/*
@Entity(name = "Student")
@Table(name = "T_STUDENT")
@NamedQueries({
        @NamedQuery(name = "HQL_GET_STUDENT_BY_KEY", query = "from Student where skey = :skey"),
        @NamedQuery(name = "HQL_GET_STUDENT_BY_NAME_PARTIAL", query = "from Student where name like :name order by name asc")
})
public class Student {

    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy="uuid")
    @Column(name="STUDENT_KEY", columnDefinition = "CHAR(32)")
    @Id
    @Getter
    @Setter
    protected String skey;

    @Column(name="STUDENT_ID")
    @Getter
    @Setter
    protected String id;

    @Column(name="STUDENT_NAME")
    @Getter
    @Setter
    protected String name;

    @Embedded
    @Getter
    @Setter
    protected BlobLocation photo;

    public Student() {}

    public Student(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public Student(String key, String id, String name) {
        this.skey = key;
        this.id = id;
        this.name = name;
    }
    */
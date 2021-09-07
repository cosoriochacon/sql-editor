CREATE DATABASE sqleditor;

USE sqleditor;


CREATE TABLE usuario (
	idusuario INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(256) NOT NULL,
    usuario VARCHAR(50) NOT NULL,
    password VARCHAR(256) NOT NULL,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    PRIMARY KEY (idusuario)
);

SELECT * FROM usuario;

CREATE TABLE DBS (
	iddatabase INT NOT NULL AUTO_INCREMENT,
    nombreDB VARCHAR(256) NOT NULL,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    PRIMARY KEY (iddatabase)
);

SELECT * FROM DBS;


CREATE TABLE querys (
	idquery INT NOT NULL AUTO_INCREMENT,
    query TEXT NOT NULL,
    cant int not null,
    fields VARCHAR(256) not null,
    tableName VARCHAR(256) not null,
    iddatabase INT NOT NULL,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    PRIMARY KEY (idquery),
    UNIQUE(iddatabase, tableName),
    FOREIGN KEY(iddatabase) REFERENCES DBS(iddatabase)
);

SELECT * FROM querys;

select d.iddatabase, d.nombreDB, d.estado, q.tableName, q.query 
from DBS d
inner join querys q on(d.iddatabase = q.iddatabase)
where d.estado = 'Activo';




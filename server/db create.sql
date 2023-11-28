CREATE TABLE Favourite(
  f_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  f_date TIMESTAMP,
  f_name VARCHAR(100)
);

CREATE TABLE Image(
  i_tim INT8 PRIMARY KEY,
  i_filename VARCHAR(255),
  i_format VARCHAR(10),
  i_size INTEGER
);

CREATE TABLE Thread(
  t_number INTEGER PRIMARY KEY,
  t_date TIMESTAMP NOT NULL,
  t_archived BOOL,
  t_tag VARCHAR(255),
  t_replies INTEGER,
  t_link VARCHAR(255) NOT NULL,
  i_tim INT8,
  FOREIGN KEY (i_tim) REFERENCES Image(i_tim)
);

CREATE TABLE Post(
  p_number INTEGER PRIMARY KEY,
  p_date TIMESTAMP,
  p_name VARCHAR(100) DEFAULT('Anon'),
  p_com TEXT,
  p_link VARCHAR(255),
  t_number INTEGER,
  i_tim INT8,
  FOREIGN KEY (t_number) REFERENCES Thread(t_number),
  FOREIGN KEY (i_tim) REFERENCES Image(i_tim)
);

CREATE TABLE replies(
  p_number INTEGER,
  r_number INTEGER,
  FOREIGN KEY (p_number) REFERENCES Post(p_number),
  FOREIGN KEY (r_number) REFERENCES Post(p_number)
);

CREATE TABLE favourite_has_thread(
  f_id INTEGER NOT NULL,
  t_number INTEGER NOT NULL,
  FOREIGN KEY (f_id) REFERENCES Favourite(f_id) ON DELETE CASCADE,
  FOREIGN KEY (t_number) REFERENCES Thread(t_number)
);





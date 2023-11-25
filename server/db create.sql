CREATE TABLE Favourite(
  f_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  d_date TIMESTAMP,
  f_name VARCHAR(100)
);

CREATE TABLE Thread(
  t_number INTEGER PRIMARY KEY,
  t_date TIMESTAMP NOT NULL,
  t_archived BOOL,
  t_tag VARCHAR(255),
  t_filename VARCHAR(255),
  t_size INTEGER,
  t_tim INT8,
  t_replies INTEGER,
  t_link VARCHAR(255) NOT NULL
);

CREATE TABLE Post(
  p_number INTEGER PRIMARY KEY,
  p_date TIMESTAMP,
  p_name VARCHAR(100) DEFAULT('Anon'),
  p_filename VARCHAR(255),
  p_filesize INTEGER,
  p_tim INT8,
  p_com TEXT,
  p_link VARCHAR(255),
  t_number INTEGER,
  FOREIGN KEY (t_number) REFERENCES Thread(t_number)
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





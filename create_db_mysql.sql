
-- Drops the friday_exercise_2-db if it exists currently --
DROP DATABASE IF EXISTS friday_exercise_2_db_2;
DROP DATABASE IF EXISTS friday_excercise_2_db;

-- Creates the "friday_exercise_2" database --
CREATE DATABASE friday_exercise_2_db_2;

-- Make it so all of the following code will affect friday_exercise_2_db --
USE friday_exercise_2_db_2;

#-- Creates the table "song_table" within friday_exercise_2_db --

CREATE TABLE album_table (
-- Create a numeric column called "id" which automatically increments and cannot be null --
	id integer auto_increment,
-- Make a string column called "computer_language" which cannot contain null --
	artist VARCHAR(50),
-- Make a string column called "computer_language" which cannot contain null --
	album_title VARCHAR(500),
-- Make a string column called "computer_language" which cannot contain null --
	album_year year,
-- Make a string column called "computer_language" which cannot contain null --
	total_score decimal (5,2),
-- Make a string column called "computer_language" which cannot contain null --
	us_score decimal (5,2),
-- Make a string column called "computer_language" which cannot contain null --
	uk_score decimal (5,2),
-- Make a string column called "computer_language" which cannot contain null --
	europe_score decimal (5,2),
-- Make a string column called "computer_language" which cannot contain null --
	row_score decimal (5,2),
-- Set the primary key of the table to id --
	primary key (id)
);

-- INSERT INTO table_quiz
-- (quiz_data)
-- values 
-- ('quiz data 1'),
-- ('quiz data 2'),
-- ('quiz data 3')



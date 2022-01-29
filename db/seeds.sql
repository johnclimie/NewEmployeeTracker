USE tracker_db;

INSERT INTO department (name) 
VALUES
    ('Tech'),
    ('Marketing'),
    ('Resources'),
    ('Education');

INSERT INTO role (title, salary, department_id)
VALUES 
    ('Developer', 50000, 1),
    ('Components', 55000, 1),
    ('Social Media', 40000, 2),
    ('Advertisment',  45000, 2),
    ('Human Resources', 48000, 3),
    ('Customer Support', 40000, 3),
    ('Trainer', 30000, 4),
    ('Supporting Trainer', 25000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Mike', 'Davis', 1, null),
    ('Jim', 'Jackson', 1, 1),
    ('Madi', 'Smith', 2, null),
    ('Kim', 'Johnson', 2, 3),
    ('Tim', 'Tebow', 3, null),
    ('Courtney', 'Hanks', 3, 5),
    ('Dante', 'Herron', 4, null),
    ('Jake', 'Oneil', 4, 7),
    ('Trent', 'Davis', 5, null),
    ('Alyssa', 'Neil', 5, 9), 
    ('Anthony', 'Williams', 6, null),
    ('David', 'Brown', 6, 11),
    ('Justin', 'Jones', 7, null),
    ('Emily', 'Rodriguez', 7, 13),
    ('Dylan', 'Miller', 8, null),
    ('Jimi', 'Hendrix', 8, 15);





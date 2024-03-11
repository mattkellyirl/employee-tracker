INSERT INTO department (name)
VALUES  ('Drivers'),
        ('Leadership'),
        ('Management'),
        ('Reserve Drivers');

INSERT INTO role (title, salary, department_id)
VALUES  ('Racing Driver', 2000000, 1),
        ('Team Principal', 1000000, 2),
        ('Chief Operating Officer', 500000, 3),
        ('Chief Financial Officer', 500000, 3),
        ('Development Driver', 250000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES  ('Lando', 'Norris', 1),
        ('Oscar', 'Piastri', 1),
        ('Zak', 'Brown', 2),
        ('Andrea', 'Stella', 2),
        ('Piers', 'Thynne', 3),
        ('Laura', 'Bowden', 4),
        ('Pato', 'OWard', 5),
        ('Alex', 'Palou', 5);

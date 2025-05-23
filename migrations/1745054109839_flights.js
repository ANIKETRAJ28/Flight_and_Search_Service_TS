/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE flights (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      flight_number VARCHAR(20) NOT NULL UNIQUE DEFAULT 'FLIGHT_' || substring(gen_random_uuid()::text from 1 for 8),
      airplane_id UUID NOT NULL,
      departure_airport_id UUID NOT NULL,
      arrival_airport_id UUID NOT NULL,
      departure_time TIMESTAMP NOT NULL,
      arrival_time TIMESTAMP NOT NULL,
      status flight_status NOT NULL DEFAULT 'SCHEDULED',
      price DECIMAL(10, 2) NOT NULL,
      booked_seats INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  // add foreign key constraints to airplanes table
  pgm.sql(`
    ALTER TABLE flights
    ADD CONSTRAINT fk_airplane
    FOREIGN KEY (airplane_id)
    REFERENCES airplanes(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
  `);
  // add foreign key constraints to airports table
  pgm.sql(`
    ALTER TABLE flights
    ADD CONSTRAINT fk_departure_airport
    FOREIGN KEY (departure_airport_id)
    REFERENCES airports(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
  `);
  // add foreign key constraints to airports table
  pgm.sql(`
    ALTER TABLE flights
    ADD CONSTRAINT fk_arrival_airport
    FOREIGN KEY (arrival_airport_id)
    REFERENCES airports(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // drop foreign key constraints to airplanes table
  pgm.sql(`
    ALTER TABLE flights
    DROP CONSTRAINT fk_airplane
  `);
  // drop foreign key constraints to airports table
  pgm.sql(`
    ALTER TABLE flights
    DROP CONSTRAINT fk_departure_airport
  `);
  // drop foreign key constraints to airports table
  pgm.sql(`
    ALTER TABLE flights
    DROP CONSTRAINT fk_arrival_airport
  `);
  // drop flights table
  pgm.sql(`
    DROP TABLE flights
  `);
};

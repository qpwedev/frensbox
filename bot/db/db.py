import sqlite3
from sqlite3 import Error
import time


class Database:
    def __init__(self, db_file):
        self.conn = None
        try:
            self.conn = sqlite3.connect(db_file)
            self.create_tables()
        except Error as e:
            print(e)

    def create_tables(self):
        try:
            cur = self.conn.cursor()

            # Create users table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    user_id INTEGER PRIMARY KEY,
                    username TEXT NOT NULL UNIQUE,
                    lens_handle TEXT UNIQUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Create user_interests table
            cur.execute("""
            CREATE TABLE IF NOT EXISTS user_interests (
                user_id INTEGER,
                interest TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            );
            """)

            # Create friends table
            cur.execute("""
            CREATE TABLE IF NOT EXISTS friends (
                friend_1_id INTEGER,
                friend_2_id INTEGER,
                FOREIGN KEY (friend_1_id) REFERENCES users (user_id),
                FOREIGN KEY (friend_2_id) REFERENCES users (user_id)
            );
            """)

            # Create notifications table
            cur.execute("""
            CREATE TABLE IF NOT EXISTS notifications (
                notification_id INTEGER PRIMARY KEY,
                user_id INTEGER,
                text TEXT NOT NULL,
                processed BOOLEAN DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            );
            """)
        except Error as e:
            print(e)

    def insert_user(self, user_id, username, lens_handle=None):
        cur = self.conn.cursor()
        cur.execute(
            "INSERT OR IGNORE INTO users (user_id, username, lens_handle) VALUES (?, ?, ?)", (user_id, username, lens_handle,))
        self.conn.commit()

    def delete_user(self, user_id):
        cur = self.conn.cursor()
        cur.execute("DELETE FROM users WHERE user_id = ?", (user_id,))
        self.conn.commit()

    def insert_interest(self, user_id, interest):
        cur = self.conn.cursor()
        cur.execute(
            "INSERT INTO user_interests (user_id, interest) VALUES (?, ?)", (user_id, interest,))
        self.conn.commit()

    def delete_interest(self, user_id, interest):
        cur = self.conn.cursor()
        cur.execute(
            "DELETE FROM user_interests WHERE user_id = ? AND interest = ?", (user_id, interest,))
        self.conn.commit()

    def insert_friend(self, friend_1_id, friend_2_id):
        cur = self.conn.cursor()
        cur.execute("INSERT INTO friends (friend_1_id, friend_2_id) SELECT ?, ? WHERE NOT EXISTS(SELECT 1 FROM friends WHERE (friend_1_id = ? AND friend_2_id = ?) OR (friend_1_id = ? AND friend_2_id = ?))",
                    (friend_1_id, friend_2_id, friend_1_id, friend_2_id, friend_2_id, friend_1_id))
        self.conn.commit()

    def delete_friend(self, friend_1_id, friend_2_id):
        cur = self.conn.cursor()
        # The friend relationship is deleted regardless of the id order
        cur.execute("DELETE FROM friends WHERE (friend_1_id = ? AND friend_2_id = ?) OR (friend_1_id = ? AND friend_2_id = ?)",
                    (friend_1_id, friend_2_id, friend_2_id, friend_1_id))
        self.conn.commit()

    def insert_notification(self, user_id, text):
        cur = self.conn.cursor()
        cur.execute(
            "INSERT INTO notifications (user_id, text) VALUES (?, ?)", (user_id, text))
        self.conn.commit()

    def change_notification_status(self, notification_id, status):
        cur = self.conn.cursor()
        cur.execute("UPDATE notifications SET processed = ? WHERE notification_id = ?",
                    (status, notification_id))
        self.conn.commit()

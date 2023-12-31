import pkg, { QueryResult } from 'pg';
import dotenv from 'dotenv';
import { INameDB } from './pg.interfase.js';

dotenv.config();

const { Pool, Client } = pkg;

const client = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT as unknown as number,
    database: process.env.POSTGRES_NAME,
});

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT as unknown as number,
    database: 'cherryconect',
});


async function createDatabaseAndTables() {
    await client.connect();
    const { rows }: QueryResult<INameDB> = await client.query(`SELECT 1 FROM pg_database WHERE datname = 'cherryconect'`);
    
    if(!rows.length) {
        await client.query(`CREATE DATABASE cherryconect`);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS public."user"
            (
                id uuid NOT NULL,
                name character varying(50) COLLATE pg_catalog."default" NOT NULL,
                surname character varying(50) COLLATE pg_catalog."default" NOT NULL,
                CONSTRAINT user_pkey PRIMARY KEY (id)
            )`
        );
                
        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.active
            (
                id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
                "isActive" boolean DEFAULT false,
                link uuid NOT NULL,
                user_id uuid NOT NULL,
                CONSTRAINT "Active_pkey" PRIMARY KEY (id),
                CONSTRAINT user_id FOREIGN KEY (user_id)
                    REFERENCES public."user" (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
                    NOT VALID
            )`
        );

        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.user_info
            (
                id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
                email character varying(50) COLLATE pg_catalog."default" NOT NULL,
                city character varying(50) COLLATE pg_catalog."default" NOT NULL,
                password character varying(100) COLLATE pg_catalog."default" NOT NULL,
                user_id uuid NOT NULL,
                logo character varying COLLATE pg_catalog."default" NOT NULL DEFAULT 'default_logo/anonym.jpg'::character varying,
                CONSTRAINT user_info_pkey PRIMARY KEY (id),
                CONSTRAINT user_id FOREIGN KEY (user_id)
                    REFERENCES public."user" (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
                    NOT VALID
            )`
        );

        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.relationship
            (
                id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
                user1 uuid NOT NULL,
                user2 uuid NOT NULL,
                relationship_status boolean NOT NULL DEFAULT false,
                CONSTRAINT relationship_pkey PRIMARY KEY (id)
            )`
        );

        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.post
            (
                id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
                text text COLLATE pg_catalog."default",
                user_id uuid,
                link character varying(255) COLLATE pg_catalog."default",
                type character varying(5) COLLATE pg_catalog."default",
                create_time time without time zone,
                "like" integer DEFAULT 0,
                CONSTRAINT post_pkey PRIMARY KEY (id),
                CONSTRAINT user_id FOREIGN KEY (user_id)
                    REFERENCES public."user" (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE CASCADE
                    NOT VALID
            )`
        );

        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.reset_password
            (
                id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
                reset_link uuid NOT NULL,
                user_id uuid NOT NULL,
                CONSTRAINT reset_passwords_pkey PRIMARY KEY (id),
                CONSTRAINT user_id FOREIGN KEY (user_id)
                    REFERENCES public."user" (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
                    NOT VALID
            )`
        );

        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.conversation
            (
                id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
                user1 uuid NOT NULL,
                user2 uuid NOT NULL,
                CONSTRAINT conversation_pkey PRIMARY KEY (id)
            )`
        );

        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.message
            (
                id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
                conversation_id integer NOT NULL,
                sender_id uuid NOT NULL,
                recipient_id uuid NOT NULL,
                text text COLLATE pg_catalog."default",
                link character varying COLLATE pg_catalog."default",
                type character varying COLLATE pg_catalog."default",
                is_new boolean DEFAULT true,
                create_time time without time zone,
                CONSTRAINT message_pkey PRIMARY KEY (id),
                CONSTRAINT conversation_id FOREIGN KEY (conversation_id)
                    REFERENCES public.conversation (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE CASCADE
                    NOT VALID
            )`
        );

        await pool.query(`
        CREATE TABLE IF NOT EXISTS public."like"
        (
            id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
            post_id integer,
            user_id uuid,
            CONSTRAINT likes_pkey PRIMARY KEY (id),
            CONSTRAINT post_id FOREIGN KEY (post_id)
                REFERENCES public.post (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID,
            CONSTRAINT user_id FOREIGN KEY (user_id)
                REFERENCES public."user" (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID
            )`
        );

    }
    await client.end();
}

export { pool, createDatabaseAndTables };
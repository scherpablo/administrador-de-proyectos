import mongoose, { connection } from 'mongoose'
import { exit } from 'node:process'
import dotenv from 'dotenv'
import colors from 'colors'

dotenv.config()

const DB_URL = process.env.DATABASE_URL

export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(DB_URL)
        const url = `${connection.host}:${connection.port}`
        console.log(colors.bgGreen(`Base de Datos conectada en: ${url}`))
    } catch (error) {
        console.log(colors.bgRed("Error al conectar la Base de Datos"))
        exit(1)    
    }
} 
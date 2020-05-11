import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import { Server } from 'typescript-rest'
import BaseController from './controller/BaseController'
import path from 'path'

const server = express()

server.use(express.static("dist"));

server.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }))
server.use(bodyParser.json({ limit: '5mb' }))
server.use(cookieParser())

Server.buildServices(server, BaseController)


export default server

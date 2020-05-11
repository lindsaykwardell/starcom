import { GET, Path, QueryParam, ContextResponse } from 'typescript-rest'
import { Produces } from 'typescript-rest-swagger'
import { log } from '../config/log'
import express from 'express'
import path from 'path'

@Produces('application/json')
export default class BaseController {
  private className = 'BaseController'

  // @Path('*')
  @GET
  public async getHelloWorld(@ContextResponse res: express.Response) {
    const methodName = 'GET /'
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  }
}

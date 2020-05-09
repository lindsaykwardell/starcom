import { GET, Path, QueryParam } from 'typescript-rest'
import { Produces } from 'typescript-rest-swagger'
import { log } from '../config/log'

@Produces('application/json')
export default class BaseController {
  private className = 'BaseController'

  @Path('hello')
  @GET
  public async getHelloWorld(@QueryParam('name') name: string) {
    const methodName = 'GET /hello'
    log(this.className, methodName, `name : ${name}`)

    return { msg: `Hello, ${name}!` }
  }
}

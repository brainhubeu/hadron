export default class Response {
  public status: any;
  public body: any;
  constructor(body, status) {
    this.body = body;
    this.status = status;
  }
}

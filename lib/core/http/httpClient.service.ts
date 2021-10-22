import { injectable } from "inversify";
import { ajax, AjaxConfig, AjaxResponse } from "rxjs/ajax";
import { Observable } from "rxjs";
import xhr2 from "xhr2";

const XHR2 = typeof XMLHttpRequest !== "undefined" ? XMLHttpRequest : xhr2;

@injectable()
export class HttpClient {
  request<T>(config: AjaxConfig): Observable<AjaxResponse<T>> {
    return ajax<T>({ createXHR: () => new XHR2(), ...config });
  }
}

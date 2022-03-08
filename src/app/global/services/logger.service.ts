import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  info(msg: any): void {
    console.log('%cInfo ', 'color: white; background-color: #d3d13f', msg);
  }

  infoApiRequest(header: string, msg: any): void {
    console.log(`%cAPI -> ${header}`, 'color: white; background-color: #10a7d6', msg);
  }

  infoApiResponse(header: string, msg: any, time: any): void {

    let timeStyle = 'color: lime; background-color: green';
    if (time > 250) {
      timeStyle = 'color: yellow; background-color: #806c0a';
    }
    if (time > 1000){
      timeStyle = 'color: white; background-color: #a20c0c';
    }
    console.log(`%cAPI <- %c${time} ms%c ${header}`, 'color: white; background-color: #0c7fa2', timeStyle, 'color: white; background-color: #0c7fa2', msg);
  }


  getColorByMethod(method: string, way: string): string{
    const colorMap = {
      to:{
        GET: '#10a7d6',
        PUT: '#fca130',
        POST: '#49cc90',
        DELETE: '#f93e3e'
      },
      from:{
        GET: '#0c7fa2',
        PUT: '#bc7c26',
        POST: '#379b69',
        DELETE: '#a02121'
      }
    }
    return colorMap[way][method];
  }

  apiRequest(method: string, header: string, msg: any): void {
    console.log(`%cAPI -> ${header}`, `color: white; background-color: ${this.getColorByMethod(method, 'to')}`, msg);
  }
  apiResponse(method: string, header: string, msg: any, time: any): void {

    let timeStyle = 'color: lime; background-color: green';
    if (time > 250) {
      timeStyle = 'color: yellow; background-color: #806c0a';
    }
    if (time > 1000){
      timeStyle = 'color: white; background-color: #a20c0c';
    }

    const color = this.getColorByMethod(method, 'from');

    console.log(`%cAPI <- %c${time} ms%c ${header}`, `color: white; background-color: ${color}`, timeStyle, `color: white; background-color: ${color}`, msg);
  }

  debug(msg: any): void {
    console.log('%cDebug ', 'color: white; background-color: #d684fc', msg);
  }

  error(msg: string): void {
    console.error('%cError ', 'color: white; background-color: #D33F49', msg);
  }
  warning(msg: string): void {
    console.error('%cError ', 'color: black; background-color: #e7ad00;', msg);
  }
}

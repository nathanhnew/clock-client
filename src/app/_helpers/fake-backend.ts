import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';


export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions){
  backend.connections.subscribe((connection: MockConnection) => {
    let testUser = { username: 'test', password: 'test', firstName: 'Test', lastName: 'Jones'};

    //timeout simulates api call
    setTimeout(() => {

      // Fake authenticate api endpoint
      if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post){
        let params = JSON.parse(connection.request.getBody());

        if(params.username === testUser.username && params.password === testUser.password){
          connection.mockRespond(new Response(
            new ResponseOptions({ status: 200, body: { token: 'fake-jwt-token' } })
          ));
        } else{
          connection.mockRespond(new Response(
            new ResponseOptions({ status: 200 })
          ));
        }
      }

      // Fake user api endpoint
      if(connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Get) {
        // Check for fake auth token in header and return if validation
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          connection.mockRespond(new Response(
            new ResponseOptions({ status: 200, body: [testUser] })
          ));
        }else{
          // Return 401 not authorized if token invalid or null
          connection.mockRespond(new Response(
            new ResponseOptions({ status: 401 })
          ));
        }
      }
    }, 500);
  });
  return new Http(backend, options)
}

export let fakeBackendProvider = {
  // use fake backend in place of Http for backend-less development
  provide: Http,
  useFactory: fakeBackendFactory,
  deps: [MockBackend, BaseRequestOptions]
}

export const valueShadowing = {
  collectionName: {
    content: () => 'Please select the collection to search/index from',
    description:
      () => `Accessing the root object eg Request["item"] searches across all available collections and returns the first item that matches. Potentially leading to the correct value being shadowed. Available collections include:
    - QueryString: The values of variables in the HTTP query string.
    - Form: The values of form elements in the HTTP request body.
    - Cookies: The values of cookies sent in the HTTP request.
    - ClientCertificate: The values of fields stored in the client certificate that is sent in the HTTP request.
    - ServerVariables: The values of predetermined environment variables.`,
    guidance: () => `See 
    - https://learn.microsoft.com/en-us/previous-versions/iis/6.0-sdk/ms524948(v=vs.90),
    - https://learn.microsoft.com/en-us/dotnet/api/system.web.httprequest?view=netframework-4.8.1`,
  },
}

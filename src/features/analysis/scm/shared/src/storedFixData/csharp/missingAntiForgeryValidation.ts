export const missingAntiForgeryValidation = {
  guidance: () =>
    `The \`ValidateAntiForgeryToken\` attribute helps prevent cross-site request forgery (CSRF) attacks.\
    The token is automatically injected into the view by the [FormTagHelper](https://learn.microsoft.com/en-us/aspnet/core/mvc/views/working-with-forms?view=aspnetcore-8.0#the-form-tag-helper)
    and is included when the form is submitted by the user.\
    The token is validated by the \`ValidateAntiForgeryToken\` attribute.\
    The token could be also generated using the [Html.AntiForgeryToken](https://learn.microsoft.com/en-us/dotnet/api/system.web.mvc.htmlhelper.antiforgerytoken?view=aspnet-mvc-5.2) helper.\
    
    \n&nbsp;
    
    \n***Make sure this controller's client provides the validation token before approving this change.***  
    \n&nbsp;
    
    \nThis is an illustration of how the form will look like:
    \n&nbsp;

    <form method="post" action="/Action">
        <!-- Input and Submit elements -->
        <input name="__RequestVerificationToken" 
        type="hidden" value="<removed for brevity>">
    </form>
    
    \n***Notice the \`__RequestVerificationToken\` parameters.***
    `,
}

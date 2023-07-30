import org.apache.log4j.Logger;
import javax.ws.rs.client.*;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class JaxWsSSRF extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String url = request.getParameter("url");
        String url2 = request.getParameter("url2");
        Logger logger = null;
        logger.debug(url);
        logger.debug((String) url);
        logger.debug("the url is: " + url);
        logger.debug("the url is: " + url + "alternative url is: " + url2);  // codeql doesn't point to the exact term
    }
}

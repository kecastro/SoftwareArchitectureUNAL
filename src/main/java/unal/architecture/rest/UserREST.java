package unal.architecture.rest;

import unal.architecture.dao.UserCredentialsDAO;
import unal.architecture.entity.User;
import unal.architecture.entity.UserCredentials;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Stateless
@Path("users")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UserREST {
    @PersistenceContext
    private EntityManager em;
    @EJB
    UserCredentialsDAO userDAO;

    @GET
    public List<UserCredentials> list() {
        return userDAO.findAll();
    }

    @POST
    public UserCredentials create(UserCredentials credentials) {
        em.persist(credentials);
        User user = new User();
        user.setName(credentials.getUsername());
        user.setCredentials(credentials);
        em.persist(user);
        return credentials;
    }

    @GET
    @Path("{username}")
    public UserCredentials show(@PathParam("username") String username) {
        return em.find(UserCredentials.class, username);
    }

    @PUT
    @Path("{username}")
    public UserCredentials update(@PathParam("username") String username, UserCredentials credentials) {
        credentials.setUsername(username);
        em.merge(credentials);
        return credentials;
    }

    @DELETE
    @Path("{username}")
    public void delete(@PathParam("username") String username) {
        UserCredentials credentials = em.find(UserCredentials.class, username);
        em.remove(credentials.getUser());
        em.remove(credentials);
        return;
    }
}

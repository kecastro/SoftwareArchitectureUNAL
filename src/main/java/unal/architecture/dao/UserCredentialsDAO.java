package unal.architecture.dao;

import unal.architecture.entity.UserCredentials;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;

@Stateless
public class UserCredentialsDAO {
    @PersistenceContext
    private EntityManager em;

    public List<UserCredentials> findAll() {
        TypedQuery<UserCredentials> query = em.createNamedQuery("UserCredentials.findAll", UserCredentials.class);
        return query.getResultList();
    }

    public UserCredentials findByUserId(long id) {
        TypedQuery<UserCredentials> query = em.createNamedQuery("UserCredentials.findByUserId", UserCredentials.class);
        query.setParameter("id", id);
        List<UserCredentials> credentials = query.getResultList();
        if (credentials.size() == 0)
            return null;
        else
            return credentials.get(0);
    }
}

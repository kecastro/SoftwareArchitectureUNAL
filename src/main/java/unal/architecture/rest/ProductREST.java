package unal.architecture.rest;

import unal.architecture.dao.FabricationRecipeDAO;
import unal.architecture.dao.ProductDAO;
import unal.architecture.entity.FabricationRecipe;
import unal.architecture.entity.Product;

import javax.annotation.security.RolesAllowed;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Stateless
@Path("products")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed({"ADMIN"})
public class ProductREST {
    @PersistenceContext
    private EntityManager em;
    @EJB
    ProductDAO productDAO;
    @EJB
    FabricationRecipeDAO recipesDAO = new FabricationRecipeDAO();

    @GET
    public List<Product> list() {
        return productDAO.findAll();
    }

    @POST
    public Product create(Product product) {
        product.setId(0);

        if (product.getRecipes() != null)
            for (FabricationRecipe fabricationRecipe : product.getRecipes()) {
                fabricationRecipe.setProduct(product);
            }

        em.persist(product);
        return product;
    }

    @GET
    @Path("{id}")
    public Product show(@PathParam("id") long id) {
        return em.find(Product.class, id);
    }

    @PUT
    @Path("{id}")
    public Product update(@PathParam("id") long id, Product product) {
        product.setId(id);

        for (FabricationRecipe fabricationRecipe : product.getRecipes()) {
            fabricationRecipe.setProduct(product);
        }

        List<FabricationRecipe> toErase = em.find(Product.class, id).getRecipes();
        toErase.removeAll(product.getRecipes());


        if (toErase != null)
            for (FabricationRecipe fabricationRecipe : toErase) {
                recipesDAO.delete(fabricationRecipe.getId());
            }

        em.merge(product);
        return product;
    }

    @DELETE
    @Path("{id}")
    public void delete(@PathParam("id") long id) {
        productDAO.remove(id);
    }
}

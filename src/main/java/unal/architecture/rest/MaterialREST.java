package unal.architecture.rest;

import unal.architecture.entity.Material;
import unal.architecture.service.MaterialService;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Stateless
@Path("materials")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class MaterialREST {
    @PersistenceContext
    private EntityManager em;
    @EJB
    MaterialService materialService;

    @GET
    public List<Material> list() {
        return materialService.findAll();
    }

    @POST
    public Material create(Material material) {
        material.setId(0);
        em.persist(material);
        return material;
    }

    @GET
    @Path("{id}")
    public Material show(@PathParam("id") long id) {
        return em.find(Material.class, id);
    }

    @PUT
    @Path("{id}")
    public Material update(@PathParam("id") long id, Material material) {
        material.setId(id);
        em.merge(material);
        return material;
    }

    @DELETE
    @Path("{id}")
    public void delete(@PathParam("id") long id) {
        em.remove(em.find(Material.class, id));
        return;
    }
}
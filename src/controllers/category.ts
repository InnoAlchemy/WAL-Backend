import { RequestHandler } from "express";
import Category from "#/models/category"; 

export const addCategory: RequestHandler = async (req, res) => {
  try {
    const { name,type,description } = req.body;

    const categroy = await Category.create({
        name,
        type,
        description,
    });

    res.status(201).json({ categroy });
  } catch (error) {
    console.error("Error adding a category:", error);
    res.status(400).json({ error: "Failed to add a category" });
  }
};

export const getCategoryById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
  
      const category = await Category.findById(id);
  
      if (!Category) 
        return res.status(404).json({ error: "Category not found" });
      
      res.status(200).json({
        data:category
      });
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
export const getAllTypes: RequestHandler = async (req, res) => {
    try {

      const types = await Category.distinct('type');
  
      if (!types) 
        return res.status(404).json({ error: "Types are not found" });
      
      res.status(200).json({
        data:types
      });

    } catch (error) {
      console.error("Error fetching types:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
export const getCategoryByType: RequestHandler = async (req, res) => {
    try {
      const { type } = req.body;
      
      const categories = await Category.find({type});
  
      if (!categories) 
        return res.status(404).json({ error: "Categories are not found" });
      
      res.status(200).json({
        data:categories
      });
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const updateCategory: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { name,type, description } = req.body;
        if(!name || !type || !description)return res.status(404).json({ error: 'All field must be filled' });
      const updateData: any = {};
       updateData.name = name;
       updateData.type = type;
       updateData.description = description;
  
      const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true, 
      });
  
      if (!updatedCategory) 
        return res.status(404).json({ error: 'Category is not found' });
      
  
      res.status(200).json({updatedCategory});
    } catch (error) {
      console.error('Error updating Category:', error);
      res.status(400).json({ error: 'Bad request' });
    }
  };

 export const deleteCategory: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
    
      const deletedCategory = await Category.findByIdAndDelete(id);
   
      if (!deletedCategory) 
        return res.status(404).json({ error: 'Category not found' });
      
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting Category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  
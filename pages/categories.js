import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function CategoriesPage({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategrories();
  }, []);

  function fetchCategrories() {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategrories();
  }

  async function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: `Are you sure you want to delete ${category.name}?`,
        showCancelButton: true,
        confirmButtonText: `Delete`,
        confirmButtonColor: "#d55",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`/api/categories?_id=${category._id}`);
          fetchCategrories();
        }
      });
  }

  function addProperty() {
    setProperties((oldProperties) => {
      return [...oldProperties, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(index, prop, newName) {
    setProperties((oldProperties) => {
      const newProperties = [...oldProperties];
      newProperties[index] = { ...prop, name: newName };
      return newProperties;
    });
  }
  function handlePropertyValuesChange(index, prop, newValues) {
    setProperties((oldProperties) => {
      const newProperties = [...oldProperties];
      newProperties[index] = { ...prop, values: newValues };
      return newProperties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((oldProperties) => {
      return [...oldProperties].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name} `
          : "Create New Category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="">No Parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id} key={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            type="button"
            className="mb-2 text-sm btn-default"
            onClick={addProperty}
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((prop, index) => (
              <div className="flex gap-1" key={index}>
                <input
                  type="text"
                  placeholder="property name (example: color)"
                  value={prop.name}
                  onChange={(ev) =>
                    handlePropertyNameChange(index, prop, ev.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="values, comma separated"
                  value={prop.values}
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, prop, ev.target.value)
                  }
                />
                <button
                  className="btn-red"
                  onClick={() => removeProperty(index)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              className="btn-default"
              onClick={() => {
                setEditedCategory(null),
                  setName(""),
                  setParentCategory(""),
                  setProperties([]);
              }}
              type="button"
            >
              Cancel
            </button>
          )}

          <button type="submit" className="py-1 btn-primary">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="mt-4 basic">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent Category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      className="mr-1 btn-default"
                      onClick={() => editCategory(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-red"
                      onClick={() => deleteCategory(category)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => (
  <CategoriesPage swal={swal} ref={ref} />
));

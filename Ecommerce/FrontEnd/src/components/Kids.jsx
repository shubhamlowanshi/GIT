import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import axios from 'axios';
import ProductGrid from '../components/ProductGrid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 8;

const KidsCollection = ({ onAddToCart }) => {
  const [kidsCollection, setKidsCollection] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products/kids');
        setKidsCollection(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (item) => {
    onAddToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  const totalPages = Math.ceil(kidsCollection.length / ITEMS_PER_PAGE);
  const paginatedItems = kidsCollection.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const skeletons = Array.from({ length: ITEMS_PER_PAGE });

  return (
    <>
      <div style={{ paddingTop: '75px' }}>
      {/* <ProductGrid apiUrl="http://localhost:3000/api/products/women" title="Women's Collection" onAddToCart={onAddToCart} /> */}
      <div style={{ backgroundColor: '#90CAF9', color: 'white', fontSize: '40px', padding: '15px' }}>
        Kids' Collection
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '80px',
          marginLeft: '30px',
          justifyContent: 'start',
          padding: '40px',
          backgroundColor: '#f9f9f9',
        }}
      >
        {loading
          ? skeletons.map((_, index) => (
              <Card
                key={index}
                style={{
                  width: '280px',
                  height: '450px',
                  border: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                }}
              >
                <Placeholder as={Card.Img} animation="wave" style={{ height: '60%' }} />
                <Card.Body >
                  <Placeholder as={Card.Title} animation="wave" xs={6} />
                  <Placeholder as="p" animation="wave" xs={8} />
                  <Placeholder.Button variant="info" xs={12} />
                </Card.Body>
              </Card>
            ))
          : paginatedItems.map((item) => (
              <Card
                key={item._id}
                style={{
                  width: '280px',
                  height: '450px',
                  border: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                }}
                className="product-card"
              >
                <Card.Img
                  variant="top"
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ height: '60%', objectFit: 'cover' }}
                />
                <Card.Body style={{ padding: '16px', overflow: 'hidden' }}>
                  <Card.Title>{item.name}</Card.Title>
                  <p>{item.description}</p>
                  <Card.Text>
                    <strong>Price:</strong> ₹{item.price.toLocaleString()}
                  </Card.Text>
                  <Button
                    style={{
                      backgroundColor: '#2196f3',
                      border: 'none',
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                    }}
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            ))}
      </div>

      {!loading && (
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ marginRight: '10px' }}
          >
            Previous
          </Button>
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index + 1}
              variant={currentPage === index + 1 ? 'dark' : 'outline-dark'}
              onClick={() => handlePageChange(index + 1)}
              style={{ margin: '0 5px' }}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ marginLeft: '10px' }}
          >
            Next
          </Button>
        </div>
      )}

      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      </div>
    </>
  );
};

export default KidsCollection;

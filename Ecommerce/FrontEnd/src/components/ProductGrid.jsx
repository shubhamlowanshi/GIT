import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 8;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const ProductGrid = ({ apiUrl, title, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(apiUrl);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  const handleAddToCart = (item) => {
    onAddToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedItems = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <div style={{ backgroundColor: '#E3BE84', color: 'white', fontSize: '40px', padding: '15px' }}>
        {title}
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
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
            <AnimatePresence>
              {paginatedItems.map((item) => (
                <motion.div
                  key={item._id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  style={{ width: '280px' }}
                >
                  <Card
                    style={{
                      height: '495px',
                      border: 'none',
                      borderRadius: '16px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={item.imageUrl}
                      alt={item.name}
                      loading="lazy"
                      style={{ height: '60%', objectFit: 'cover' }}
                    />
                    <Card.Body style={{ padding: '16px' }}>
                      <Card.Title style={{ height: '30px', fontSize: '1.1rem', fontWeight: '600' }}>
                        {item.name}
                      </Card.Title>
                      <p>{item.description}</p>
                      <Card.Text>
                        <strong>Price:</strong> ₹{item.price.toLocaleString()}
                      </Card.Text>
                      <Button
                        style={{
                          backgroundColor: '#ff9800',
                          border: 'none',
                          width: '100%',
                          padding: '10px',
                          fontWeight: '500',
                          borderRadius: '8px',
                        }}
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

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
                key={index}
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
        </>
      )}
    </>
  );
};

export default ProductGrid;

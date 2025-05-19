import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';
import './orderjis.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [showTodayOrders, setShowTodayOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.username) {
          toast.error('User not logged in');
          return;
        }

        const res = await axios.get('http://localhost:3000/api/order/all');
        setOrders(res.data);
        setFilteredOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        toast.error('Failed to fetch orders');
      }
    };

    fetchOrders();
  }, []);
  // console.log(orders.username.name)

  const today = new Date().toLocaleDateString();

  const filterTodayOrders = () => {
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt).toLocaleDateString();
      return orderDate === today;
    });
    setFilteredOrders(todayOrders);
    setShowTodayOrders(true);
  };

  const showAllOrders = () => {
    setFilteredOrders(orders);
    setShowTodayOrders(false);
  };

  const handleDateRangeFilter = () => {
    const filtered = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
    setFilteredOrders(filtered);
    setShowTodayOrders(false);
    setShowDateRangePicker(false);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:3000/api/order/${orderId}`);
      const updated = orders.filter(o => o._id !== orderId);
      setOrders(updated);
      setFilteredOrders(updated);
      toast.success('Order deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete order');
    }
  };

  return (
      <div style={{ paddingTop: '53px' }}>
    <Container>
      <h2 className="text-center my-4">Order History</h2>

      <div className="text-center mb-3">
        <Button variant="primary" onClick={filterTodayOrders} className="mx-2">
          Today's Orders
        </Button>
        <Button variant="secondary" onClick={showAllOrders} className="mx-2">
          All Orders
        </Button>
        <Button
          variant={showDateRangePicker ? 'dark' : 'info'}
          onClick={() => setShowDateRangePicker(!showDateRangePicker)}
          className="mx-2"
        >
          {showDateRangePicker ? 'Hide Date Picker' : 'Select Date Range'}
        </Button>
      </div>

      {showDateRangePicker && (
        <div className="text-center my-3">
          <div className="d-flex justify-content-center gap-3 flex-wrap ">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
              className="form-control"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End Date"
              className="form-control"
            />
          </div>
          <div className="mt-3">
            <Button variant="success" onClick={handleDateRangeFilter} className="mx-2">
              ✅ Apply
            </Button>
            <Button variant="outline-danger" onClick={() => setShowDateRangePicker(false)} className="mx-2">
              ❌ Cancel
            </Button>
          </div>
        </div>
      )}

      <h4 className="text-center my-3">
        {showTodayOrders ? `Today's Orders` : `Total Orders: ${orders.length}`}
      </h4>

      <Row>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Col md={4} key={order._id} className="mb-4">
              <Card className="order-card">
                <Card.Body>
                  <Card.Title>Order #: {order._id}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Name: {order.user?.username || 'Unknown'}
                  </Card.Subtitle>

                  <Card.Text><strong>Total:</strong> ₹{order.grandTotal}</Card.Text>
                  <Card.Text>
                    <strong>Address:</strong> {order.address ? `${order.address.street}, ${order.address.city}, ${order.address.state}` : 'N/A'}
                  </Card.Text>
                  <Card.Text>
                    <strong>Mobile:</strong> {order.address?.mobile || 'N/A'}
                  </Card.Text>
                  <Card.Text>
                    <strong>Payment Method:</strong> {order.paymentInfo?.method || "cash on delivery"}
                  </Card.Text>
                  <Card.Text>
                    <strong>Payment Status:</strong>{' '}
                    <span style={{ color: order.paymentInfo?.status === 'paid' ? 'green' : 'red' }}>
                      {order.paymentInfo?.status || 'cash on delivery'}
                    </span>
                  </Card.Text>
                  <ListGroup className="list-group-flush">
                    {order.cartItems.map((item, idx) => (
                      <ListGroupItem key={idx}>
                        <img src={item.imageUrl} alt="" style={{ height: '80px', width: '80px' }} />
                        <br />
                        <strong>{item.name}</strong><br />
                        Qty: {item.qty} | ₹{item.price}
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                  <Button variant="danger" className="mt-3" onClick={() => handleDeleteOrder(order._id)}>
                    Delete Order
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">No orders found.</p>
        )}
      </Row>
    </Container>
    </div>
  );
};

export default OrderHistory;

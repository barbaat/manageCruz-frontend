import '../css/CardProfile.css';
import { useEffect } from "react";
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { useState } from "react";
import { Col, Row } from 'react-bootstrap';

export default function CardProfile({ object, profile = false }) {

  const [, setHovered] = useState(false);
  const [rol, setRol] = useState(object.rolUser);

  const cardStyles = {
    marginBottom: '20px',
    border: '4px solid rgb(0, 0, 0)',
    borderRadius: '35px',
    boxShadow: 'rgba(0, 0, 0, 0.1) 6px -3px 20px 3px',
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const cardBodyStyles = {
    display: 'flex',
    alignItems: 'center',
  };

  const cardImageStyles = {
    width: '120px',
    height: '120px',
    marginRight: '30px',
  };

  const cardTextStyles = {
    flex: '1',
  };
  
  const rolMap = {
    'REPARTIDOR': 'Repartidor 🚚',
    'ALMACEN': 'Almacén 📦',
    'ADMIN': 'Administrador',
    'OFICINA': 'Oficina 🏢',
    'CLIENTE': 'Cliente 🤝',
    'COMERCIAL': 'Comercial 📈',
  };

  useEffect(() => {
    setRol(rolMap[object.rolUser] || '');
  }, [object.rolUser]);

  const mail = "mailto:" + object.email;
  const tel = "tel:" + object.telephone;


  return (
    <>
      {profile && (
        <Card style={{
          backgroundColor: 'rgba(255, 255, 255, 0)',
          border: 'none',
        }}>
          <Row>
            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
              <div>
                <Card.Img
                  variant="top"
                  src={object.avatar}
                  style={{ width: '100%', minHeight: '200px', objectFit: 'cover' }}
                />
              </div>
            </Col>
            <Col xs={12} sm={12} md={8} lg={8} xl={8}>
              <Card.Body>
                <Card.Title>
                  <h1>
                    <b>{object.name} {object.lastName}</b>
                  </h1>
                  <h2 style={{ color: "orange" }}>
                    <b>{rol}</b>
                  </h2>
                </Card.Title>
                <Card.Text style={{ fontSize: '22px' }}>
                  Usuario: <b>{object.username}</b> <br />
                  Email: <b>{object.email}</b> <a href={mail} style={{ textDecoration: "none" }}></a><br />
                  Teléfono: <b>{object.telephone}</b> <a href={tel} style={{ textDecoration: "none" }}></a><br />
                  Ciudad: <b>{object.cityString}</b> <br />
                  DNI: <b>{object.dni}</b> <br />
                </Card.Text>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      )}

      {!profile && (
        <Link to={`/users/${object.username}`} style={{ textDecoration: "none" }}>
          <Card
            className="custom-card"
            style={cardStyles}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Card.Body style={cardBodyStyles}>
              <div>
                <Card.Img variant="top" src={object.avatar} style={cardImageStyles} />
              </div>
              <div className="text-center" style={cardTextStyles}>
                <Card.Title>{object.name} {object.lastName}</Card.Title>
                <Card.Text style={{ fontSize: "1.2rem" }}>
                  {object.username}<br />
                  <b>{rol}</b>
                </Card.Text>
                <Button variant="primary" style={{ background: "purple", color: "white" }}>Ver</Button>
              </div>
            </Card.Body>
          </Card>
        </Link>
      )}
    </>
  );
}
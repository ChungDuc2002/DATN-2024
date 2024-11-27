import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Badge, Divider, Image, Rate } from 'antd';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './style.scss';

const ProductDetail = () => {
  const { id } = useParams();
  //* Render product and quantity
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');

  const [userId, setUserId] = useState('');

  //* Rating
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  useEffect(() => {
    const getIdUser = async () => {
      const token = JSON.parse(localStorage.getItem('auth'));
      try {
        const result = await axios.get('http://localhost:5000/info', {
          headers: {
            token: `Bearer ${token}`,
          },
        });
        if (result.status === 200) {
          setUserId(result.data._id);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getIdUser();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/products/getProductById/${id}`
        );
        setProduct(response.data);
        setSelectedImage(response.data.images[0]);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product.comments && product.comments.length > 0) {
      const totalRating = product.comments.reduce(
        (acc, comment) => acc + comment.rate,
        0
      );
      const avgRating = totalRating / product.comments.length;
      console.log(avgRating);
      setAverageRating(avgRating);
    }
  }, [product.comments]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // !Quantity
  const increaseQuantity = () => {
    if (quantity < product.inventory_quantity) {
      setQuantity(quantity + 1);
    } else {
      toast.error('Bạn đã chọn số lượng vượt quá số lượng hàng trong kho');
    }
  };
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // !Add to cart
  const handleAddToCart = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/carts/getCart/${userId}`
      );
      const cart = response.data;

      const existingProduct = cart.products.find(
        (item) => item.productId === product._id
      );

      const totalQuantity = existingProduct
        ? existingProduct.quantity + quantity
        : quantity;

      if (totalQuantity > product.inventory_quantity) {
        toast.error('Bạn đã chọn số lượng vượt quá số lượng hàng trong kho');
        return;
      }

      await axios.post('http://localhost:5000/carts/addToCart', {
        userId,
        productId: product._id,
        quantity,
      });
      toast.success('Sản phẩm đã được thêm vào giỏ hàng');
    } catch (error) {
      toast.error('Bạn đã chọn số lượng vượt quá số lượng hàng trong kho');
    }
  };

  // !Comment and rating

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleAddComment = async (e) => {
    if (!userId) {
      e.preventDefault();
      toast.error('Vui lòng đăng nhập để thêm đánh giá');
      return;
    }

    if (rating === 0) {
      toast.error('Vui lòng chọn đánh giá');
      return;
    }

    const formData = new FormData();
    const imagesArray = [...images];
    imagesArray.forEach((image) => {
      formData.append('image_comment', image);
    });
    formData.append('userId', userId);
    formData.append('text', comment);
    formData.append('rate', rating);

    try {
      const response = await axios.post(
        `http://localhost:5000/products/addComment/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setComment('');
        setRating(0);
        setProduct(response.data);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm đánh giá');
    }
  };

  return (
    <>
      <div className="container wrapper-product-detail-header">
        <div className="image-gallery">
          <div className="thumbnail-images">
            {product.images?.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(item)}
                className={selectedImage === item ? 'selected' : ''}
              >
                <Image
                  src={`http://localhost:5000/uploads/${item}`}
                  preview={false}
                  className="thumbnail-image"
                />
              </div>
            ))}
          </div>
          <div className="main-image">
            <Image
              src={`http://localhost:5000/uploads/${selectedImage}`}
              preview={false}
              className="large-image"
            />
          </div>
        </div>

        {product.discount ? (
          <div className="tag-discount">
            <Badge.Ribbon
              text={`-${product.discount}%`}
              color="volcano"
            ></Badge.Ribbon>
          </div>
        ) : null}

        <div className="wrapper-product-detail-header-information">
          <h1 className="title-product">
            <Link to="/contact">{product.name}</Link>
          </h1>
          <p className="trademark">Chungduc_MO</p>
          <div className="rating">
            <Rate disabled value={averageRating} />
            <p> {product.comments?.length || 0} khách hàng đánh giá</p>
          </div>
          <div className="price">
            {product.discount ? (
              <>
                <span className="price_basic">
                  {' '}
                  {new Intl.NumberFormat().format(product.price)}đ
                </span>
                <span className="price_discount">
                  {new Intl.NumberFormat().format(
                    (product.price * (1 - product.discount / 100)).toFixed(2)
                  )}
                  đ{' '}
                </span>
              </>
            ) : (
              <span className="price_initial">
                {' '}
                {new Intl.NumberFormat().format(product.price)}đ
              </span>
            )}
          </div>
          {product?.brand ? (
            <p className="description-product">Thương hiệu : {product.brand}</p>
          ) : null}
          {product?.type === 'fashion' || product?.type === 'electronics' ? (
            <p className="description-product">Màu sắc : {product.color}</p>
          ) : null}
          {product?.type === 'fashion' ? (
            <p className="description-product">Kích cỡ : {product.sizes}</p>
          ) : null}
          {product?.type === 'book' ? (
            <p className="description-product">
              Thể loại : {product.book_category}
            </p>
          ) : null}
          <Divider />
          <p className="quantity">Số lượng: {product.inventory_quantity}</p>
          <div className="group-action">
            <span className="box">
              <button className="state-btn" onClick={decreaseQuantity}>
                -
              </button>
              <input
                type="number"
                min={1}
                step={1}
                max={30}
                inputMode="numeric"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
              <button className="state-btn" onClick={increaseQuantity}>
                +
              </button>
            </span>
            <button className="btn-action" onClick={handleAddToCart}>
              Add To Cart
            </button>
            <button className="btn-action">Mua Ngay</button>
          </div>
          <Divider />
          <p className="category">
            <span>
              Danh mục :{' '}
              {product.category?.map((item, index) => (
                <span key={index}>
                  {item}
                  {index !== product.category.length - 1 && ', '}
                </span>
              ))}
            </span>
          </p>
        </div>
      </div>
      <div className="container wrapper-product-detail-body">
        <h1 className="title-product" style={{ fontSize: '1.2rem' }}>
          Mô tả sản phẩm
        </h1>
        <div className="group-image">
          {product.images?.map((item, index) => (
            <Image
              key={index}
              src={`http://localhost:5000/uploads/${item}`}
              preview={false}
              className="image"
            />
          ))}
        </div>
        <p className="des">{product.description}</p>
        <p className="category">
          <span>
            Danh mục :{' '}
            {product.category?.map((item, index) => (
              <span key={index}>
                {item}
                {index !== product.category.length - 1 && ', '}
              </span>
            ))}
          </span>
        </p>
        <Divider />
        <div className="reviewed">
          {product.comments?.length > 0 ? (
            <h1 className="title-product">
              {product.comments?.length || 0} đánh giá cho sản phẩm{' '}
              {product.name}
            </h1>
          ) : null}
          {product.comments?.map((comment, index) => (
            <div className="form-comment" key={index}>
              <div className="avatar">
                <img
                  src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                  alt="Avatar"
                />
              </div>
              <div className="information-user">
                <div className="title">
                  <p className="name">
                    {comment?.user?.fullName || 'Unknown User'}
                  </p>
                  {'-'}
                  <p className="date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="rate-reviewed">
                  <Rate disabled value={comment.rate} />
                </div>
                <p className="comment">{comment.text}</p>
                {comment.image_comment?.map((image, idx) => (
                  <Image
                    src={`http://localhost:5000/uploads/${image}`}
                    className="image-comment"
                    key={idx}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="product-reviews">
          <h1 className="title-product">Thêm đánh giá</h1>
          <p className="des-rate">
            Đánh giá sản phẩm là cách tuyệt vời để chia sẻ trải nghiệm của bạn
            với cộng đồng. Chúng tôi rất mong nhận được ý kiến của bạn về sản
            phẩm này. Ý kiến của bạn quý giá đối với chúng tôi và sẽ giúp cải
            thiện dịch vụ của chúng tôi hơn nữa. Cảm ơn bạn đã dành thời gian để
            đánh giá sản phẩm này.
          </p>
          <Divider />
          <form action="" onSubmit={handleAddComment}>
            <div className="form-image">
              <label htmlFor="" style={{ display: 'block' }}>
                Hình ảnh
              </label>
              {images.length > 0 &&
                Array.from(images).map((image, index) => (
                  <>
                    <div className={images.length > 0 ? 'form-image' : null}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Selected"
                        key={index}
                        className="render_add-new-product"
                      />
                    </div>
                  </>
                ))}
              <input
                type="file"
                style={{ border: 'none', outline: 'none' }}
                multiple
                onChange={handleImageChange}
                onFocus={(e) => (e.target.style.outline = 'none')}
              />
            </div>
            <div className="rate">
              <label>Đánh giá của bạn về sản phẩm</label>
              <Rate onChange={setRating} value={rating} />
            </div>
            <label htmlFor="">Nhận xét của bạn</label>
            <textarea
              className="input-comment"
              placeholder="Nhập đánh giá của bạn"
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="btn-comment" type="submit">
              Gửi đánh giá
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;

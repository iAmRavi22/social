import React, { useState, useEffect } from "react";
import axios from "axios";
import "../forms/UserForm.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import twitternav from "../home/images/twitter-nav.png";
import youtubenav from "../home/images/youtube-nav.png";
import facebooknav from "../home/images/facebook-nav.png";
import instagramnav from "../home/images/instagram-nav.png";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";

const Instagram = () => {
  const currentCurrency = useSelector((state) => state.currency);

  const [formData, setFormData] = useState({
    service: "",
    name: "",
    quantity: "",
  });
  console.log("value>>>>>>>>", formData);
  console.log(formData.service?.split("|")[0]);

  const [service, setService] = useState();

  const [serviceId, setServiceId] = useState("");
  const [totalRate, setTotalRate] = useState(0);

  const [instagramServices, setInstagramServices] = useState("");
  const [boole, setBoole] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  console.log("location<>>>>>>>>>", location);

  useEffect(() => {
    const getServices = async () => {
      const object = {
        key: "cec0ad1ac6f5edb6056cfb0b815f37df",
        action: "services",
      };
      const response = await axios.post(
        "http://localhost:8000/api/services",
        object
      );
      console.log("response>>>>>>>>>>", response);
      setService(response.data);
    };
    setFormData((values) => ({
      ...values,
      service: "115",
    }));

    getServices();
  }, []);

  const InstagramService = service?.filter(
    (services) =>
      services.name.includes("Instagram") || services.name.includes("Instagram")
  );
  console.log("InstagramService>>>>>>>>>>", InstagramService);

  const servicesToFilter = [
    "Instagram Followers",
    "Instagram Likes",
    "Instagram Story Views",
  ];
  const filteredData = InstagramService?.filter((item) => {
    return servicesToFilter.some((service) => item.name.includes(service));
  });
  console.log("filterdartata>>>", filteredData);

  const handleChange = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((values) => ({ ...values, [name]: value }));

    const object = {
      key: "cec0ad1ac6f5edb6056cfb0b815f37df",
      action: "services",
      id: uuidv4(),
      serviceId: formData.service?.split("|")[0],
      quantity: value,
    };
    console.log("object>>>", object);
    if (!isNaN(object.quantity) && object.quantity >= 1000) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const response = await axios.post(
          "http://localhost:8000/api/calculatePrice",
          object
        );
        console.log("response>>>>", response);
        setTotalRate(response.data.rate);
        setServiceId(response.data.id);
      } catch (error) {
        console.log("error>>>>>>", error);
      }
    }
    console.log("NAAAAAAMMMMMM>>>.", object.quantity);
    setInstagramServices(object.quantity);

    object.quantity.includes("Instagram Likes")
      ? setBoole(true)
      : setBoole(false);
  };

  const eurRate = totalRate * 0.85;
  console.log(eurRate);

  const poundRate = totalRate * 0.73;

  const handleAddToCart = (e) => {
    e.preventDefault();

    const existingData = JSON.parse(localStorage.getItem("serviceData")) || [];

    const newFormData = {
      serviceId: formData.service?.split("|")[1],
      quantity: formData.quantity,
      link: formData.name,
      id: serviceId,
      price:
        currentCurrency.currency === "USD"
          ? totalRate
          : currentCurrency.currency === "EUR"
          ? eurRate.toFixed(2)
          : currentCurrency.currency === "GBP"
          ? poundRate.toFixed(2)
          : null,
    };
    const dataArray = Array.isArray(existingData)
      ? existingData
      : [existingData];

    dataArray.push(newFormData);
    localStorage.setItem("serviceData", JSON.stringify(dataArray));
    window.location.reload();
  };

  const handleCancel = () => {
    navigate("/cart");
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    const updatedCartData = JSON.parse(localStorage.getItem("serviceData")).map(
      (item) => {
        if (item.id === location.state.formData.id) {
          const updateData = {
            serviceId: formData.service?.split("|")[1],
            quantity: formData.quantity,
            link: formData.name,
            id: serviceId,
            price:
              currentCurrency.currency === "USD"
                ? totalRate
                : currentCurrency.currency === "EUR"
                ? eurRate.toFixed(2)
                : currentCurrency.currency === "GBP"
                ? poundRate.toFixed(2)
                : null,
          };
          return updateData;
        }
        return item;
      }
    );
    console.log("updatedCartData>>>>>>>>", updatedCartData);
    localStorage.setItem("serviceData", JSON.stringify(updatedCartData));
    navigate("/cart"); // Redirect back to the cart or another page
  };

  const handleBuyProduct = async (e) => {
    e.preventDefault();
    // const object = {
    //   key: "cec0ad1ac6f5edb6056cfb0b815f37df",
    //   action: "add",
    //   service: formData.service.split('|')[0],
    //   link: formData.user,
    //   quantity: formData.quantity,
    //   runs: '',
    //   interval: ''
    // }
    // console.log("object>>>>>>>>>>", object)
    try {
      // const response = await axios.post("http://localhost:8000/api/order", object)
      // console.log("response>>>>>>>>>", response)

      const existingData =
        JSON.parse(localStorage.getItem("serviceData")) || [];

      const newFormData = {
        serviceId: formData.service?.split("|")[1],
        quantity: formData.quantity,
        link: formData.name,
        id: serviceId,
        price:
          currentCurrency.currency === "USD"
            ? totalRate
            : currentCurrency.currency === "EUR"
            ? eurRate.toFixed(2)
            : currentCurrency.currency === "GBP"
            ? poundRate.toFixed(2)
            : null,
      };
      const dataArray = Array.isArray(existingData)
        ? existingData
        : [existingData];
      dataArray.push(newFormData);
      localStorage.setItem("serviceData", JSON.stringify(dataArray));

      navigate("/cart");
    } catch (error) {
      console.log("error>>>>>>", error);
    }
  };

  return (
    <>
      <div className="user-form  form-box">
        {location?.state?.editType === "instagram" && (
          <p>You're editing a cart item</p>
        )}
        <form>
          <div className="form-group">
            <div className="input-box">
              {/* SERVICES */}
              <label htmlFor="user">Instagram Services</label>
              {/* SELECT */}
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                {filteredData &&
                  filteredData.map((value) => {
                    return (
                      <option
                        key={value.service}
                        value={`${value.service}|${value.name}`}
                      >
                        {value.name?.split("|")[0].trim()}
                      </option>
                    );
                  })}
                {/* <p>
                          {setInstagramServices(
                            value.name?.split("|")[0].trim()
                          )}
                        </p> */}
              </select>
              <div className="svg-icons">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5 text-gray-400"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="input-box">
              <label htmlFor="user">
                {boole ? "Instagram Post Link" : "Instagram Username"}
              </label>
              <input
                type="text"
                placeholder="Enter UserName"
                id="user"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <div className="svg-icons">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5 fill-gray-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="input-box">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                placeholder="Enter Quantity"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
              <div className="svg-icons">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5 text-gray-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M13.5 4.938a7 7 0 11-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 01.572-2.759 6.026 6.026 0 012.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0013.5 4.938zM14 12a4 4 0 01-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 001.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 011.315-4.192.447.447 0 01.431-.16A4.001 4.001 0 0114 12z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
            {formData.quantity && totalRate ? (
              <div className="input-box">
                {currentCurrency.currency === "USD" ? (
                  <p>
                    Total: $<span>{totalRate}</span>{" "}
                  </p>
                ) : currentCurrency.currency === "EUR" ? (
                  <p>
                    Total: €<span>{eurRate.toFixed(2)}</span>{" "}
                  </p>
                ) : currentCurrency.currency === "GBP" ? (
                  <p>
                    Total: £<span>{poundRate.toFixed(2)}</span>{" "}
                  </p>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>
          {location?.state?.editType !== "instagram" ? (
            <div className="buttons">
              <button
                type="submit"
                className={eurRate ? "active" : "disabled"}
                onClick={handleBuyProduct}
              >
                Buy Now
              </button>
              <br></br>
              <button class="mt-16" type="submit" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          ) : (
            <div className="edit_button">
              <button type="submit" onClick={handleUpdate}>
                Update
              </button>
              <br></br>
              <button class="mt-16" type="submit" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
        </form>
        <div className="example_name">
          <span class="rounded-full-example">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </span>
          <p>
            Your profile must be publicly visible for the duration of our
            service and should not be private.
          </p>
        </div>
        <p className="exp-text">
          <b>Instagram username example :</b> <span>@cristiano</span>
        </p>
        <div className="all_services">
          <h3>All services</h3>
          <ul>
            <li>
              <Link to="/twitter">
                <img src={twitternav} alt="" />
                Twitter
              </Link>
            </li>
            <li>
              {" "}
              <Link to="/instagram">
                <img src={instagramnav} alt="" />
                Instagram
              </Link>
            </li>
            <li>
              <Link to="/facebook">
                <img src={facebooknav} alt="" />
                Facebook
              </Link>
            </li>
            <li>
              <Link to="/youtube">
                <img src={youtubenav} alt="" />
                YouTube
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Instagram;

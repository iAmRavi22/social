import { useState, useEffect } from "react";
import axios from "axios";
import "../forms/UserForm.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import twitternav from "../home/images/twitter-nav.png";
import youtubenav from "../home/images/youtube-nav.png";
import facebooknav from "../home/images/facebook-nav.png";
import instagramnav from "../home/images/instagram-nav.png";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";

const YouTube = () => {
  const currentCurrency = useSelector((state) => state.currency);

  const [serviceId, setServiceId] = useState("");
  const [totalRate, setTotalRate] = useState(0);

  const [service, setService] = useState();
  const [formData, setFormData] = useState({
    service: "",
    name: "",
    quantity: "",
  });

  const [label, setLabel] = useState("Youtube Channel Link");

  const navigate = useNavigate();
  const location = useLocation();

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

      service: "182",
    }));

    getServices();
  }, []);

  const YoutubeService = service?.filter(
    (services) =>
      services.name.includes("Youtube") || services.name.includes("Youtube")
  );
  console.log("YoutubeService>>>>>>>>>>", YoutubeService);

  const youtubeOptions = [
    "Youtube Views",
    "Youtube Shorts Views",
    "Youtube High Retention Views",
    "Youtube Comments Likes",
    "Youtube Subscribers",
    "Youtube Real Likes",
  ];
  const filteredData = YoutubeService?.filter((item) => {
    return youtubeOptions.some((service) => item.name.includes(service));
  });
  console.log("filterdartata>>>", filteredData);

  const uniqueNames = new Set();
  const uniqueFilteredData = filteredData?.filter((item) => {
    const itemName = item.name;
    if (itemName.includes("Youtube Views")) {
      if (!uniqueNames.has("Youtube Views")) {
        uniqueNames.add("Youtube Views");
        return true;
      }
    }
    if (itemName.includes("Youtube Shorts Views")) {
      if (!uniqueNames.has("Youtube Shorts Views")) {
        uniqueNames.add("Youtube Shorts Views");
        return true;
      }
    }
    if (itemName.includes("Youtube High Retention Views")) {
      if (!uniqueNames.has("Youtube High Retention Views")) {
        uniqueNames.add("Youtube High Retention Views");
        return true;
      }
    }
    if (itemName.includes("Youtube Comments Likes")) {
      if (!uniqueNames.has("Youtube Comments Likes")) {
        uniqueNames.add("Youtube Comments Likes");
        return true;
      }
    }
    if (itemName.includes("Youtube Subscribers")) {
      if (!uniqueNames.has("Youtube Subscribers")) {
        uniqueNames.add("Youtube Subscribers");
        return true;
      }
    }
    if (itemName.includes("Youtube Real Likes")) {
      if (!uniqueNames.has("Youtube Real Likes")) {
        uniqueNames.add("Youtube Real Likes");
        return true;
      }
    }
    return false;
  });

  console.log("filteredData >>>", uniqueFilteredData);

  const handleChange = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log("value>>>>", value);
    setFormData((values) => ({ ...values, [name]: value }));

    const object = {
      key: "cec0ad1ac6f5edb6056cfb0b815f37df",
      action: "services",
      id: uuidv4(),
      serviceId: formData.service.split("|")[0],
      quantity: value,
    };
    console.log("objectquantity>>>", object.quantity);
    console.log("object>>>", object);
    if (!isNaN(object.quantity) && object.quantity >= 1000) {
      try {
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

    if (
      object.quantity.includes(182) ||
      object.quantity.includes("Retention") ||
      object.quantity.includes("Real")
    ) {
      setLabel("Youtube Video Link");
    } else if (object.quantity.includes("Sho")) {
      setLabel("Youtube Short Link");
    } else if (object.quantity.includes("Comments")) {
      setLabel("Youtube Comment Link");
    } else if (object.quantity.includes("Subscribers")) {
      setLabel("Youtube Channel Link");
    } else {
      setLabel("Default");
    }
    console.log("Label>>>>>", object.quantity);
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

  const handleCancel = () => {
    navigate("/cart");
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
      <div className="user-form form-box">
        {location?.state?.editType === "youtube" && (
          <p>You're editing a cart item</p>
        )}
        <form>
          <div className="form-group">
            <div className="input-box">
              <label htmlFor="user">YouTube Service</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                {uniqueFilteredData &&
                  uniqueFilteredData.map((value) => {
                    return (
                      <option
                        key={value.service}
                        value={`${value.service}|${value.name}`}
                      >
                        {value.name?.split("|")[0].trim()}
                      </option>
                    );
                  })}
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
              <label htmlFor="user">{label}</label>

              <input
                type="text"
                placeholder="Enter Link"
                id="user"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
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
                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
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

          {location?.state?.editType !== "youtube" ? (
            <div className="buttons">
              <button
                type="submit"
                className={eurRate ? "active" : "disabled"}
                onClick={handleBuyProduct}
              >
                Buy Now
              </button>
              <br></br>
              <button className="mt-16" type="submit" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          ) : (
            <div className="edit_button">
              <button type="submit" onClick={handleUpdate}>
                Update
              </button>
              <br></br>
              <button className="mt-16" type="submit" onClick={handleCancel}>
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
            Go to your channel and click on the button with the three dots
            (mobile only). Choose "Share" and "Copy link". Otherwise, open your
            channel in your browser and copy the URL. Make sure that your
            subscriber's count is visible.
          </p>
        </div>
        <p className="exp-text">
          <b>YouTube Channel Link Example:</b>{" "}
          <span>https://www.youtube.com/channel/UCK8sQmJBp8GCxrOtXWBpyEA</span>
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

export default YouTube;

// if (object.quantity.includes("Views" || "Real"))

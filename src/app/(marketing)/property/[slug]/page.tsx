import ReadMoreText from "@/components/marketing/ReadMoreText";
import { Collapse, CollapseProps, Table, TableProps } from "antd";
import { FireExtinguisher } from "lucide-react";
import Image from "next/image";

const floorPlanColumns: TableProps["columns"] = [
  {
    title: "Floor Plan",
  },
  {
    title: "Catgegory",
  },
  {
    title: "Unit Type",
  },
  {
    title: "Floor Details",
  },
  {
    title: "Sizes",
  },
  {
    title: "Type",
  },
];

const items: CollapseProps["items"] = [
  {
    key: "1",
    label: "What is Binghatti Aquarise and where is it located?",
    children: (
      <p>
        Binghatti Aquarise is a premium residential development by Binghatti
        Developers, known for its distinctive architectural style and luxurious
        amenities. It’s strategically located in Dubai’s Jumeirah Village Circle
        (JVC), offering easy access to major highways, shopping malls, schools,
        and entertainment hubs.
      </p>
    ),
  },
  {
    key: "2",
    label: "What is Binghatti Aquarise and where is it located?",
    children: (
      <p>
        Binghatti Aquarise is a premium residential development by Binghatti
        Developers, known for its distinctive architectural style and luxurious
        amenities. It’s strategically located in Dubai’s Jumeirah Village Circle
        (JVC), offering easy access to major highways, shopping malls, schools,
        and entertainment hubs.
      </p>
    ),
  },
  {
    key: "3",
    label: "What is Binghatti Aquarise and where is it located?",
    children: (
      <p>
        Binghatti Aquarise is a premium residential development by Binghatti
        Developers, known for its distinctive architectural style and luxurious
        amenities. It’s strategically located in Dubai’s Jumeirah Village Circle
        (JVC), offering easy access to major highways, shopping malls, schools,
        and entertainment hubs.
      </p>
    ),
  },
];

export default async function PropertyPage() {
  const about = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
    ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
    in voluptate velit esse cillum dolore eu fugiat nulla pariatur.  labore et dolore magna aliqua. 
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
    ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
    in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`;

  return (
    <>
      <div className="property_banner">
        <Image
          src={"/assets/images/home-banner.jpg"}
          alt="Property banner"
          height={500}
          width={1920}
        />
        <h1 className="name">Binghatti Aquarise Summary</h1>
      </div>
      <section className="property_content">
        <div className="container">
          <div className="property_single_row">
            <div className="content_left">
              <div className="property_meta">
                <div className="content_top">
                  <div className="details">
                    <h1>Binghatti Aquarise Summary</h1>
                    <p className="developer">By Binghatti Developers</p>
                  </div>
                  <button className="brochuure_btn">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.5 6.5V6H2V6.5H2.5ZM6.5 6.5V6H6V6.5H6.5ZM6.5 10.5H6V11H6.5V10.5ZM13.5 3.5H14V3.29289L13.8536 3.14645L13.5 3.5ZM10.5 0.5L10.8536 0.146447L10.7071 0H10.5V0.5ZM2.5 7H3.5V6H2.5V7ZM3 11V8.5H2V11H3ZM3 8.5V6.5H2V8.5H3ZM3.5 8H2.5V9H3.5V8ZM4 7.5C4 7.77614 3.77614 8 3.5 8V9C4.32843 9 5 8.32843 5 7.5H4ZM3.5 7C3.77614 7 4 7.22386 4 7.5H5C5 6.67157 4.32843 6 3.5 6V7ZM6 6.5V10.5H7V6.5H6ZM6.5 11H7.5V10H6.5V11ZM9 9.5V7.5H8V9.5H9ZM7.5 6H6.5V7H7.5V6ZM9 7.5C9 6.67157 8.32843 6 7.5 6V7C7.77614 7 8 7.22386 8 7.5H9ZM7.5 11C8.32843 11 9 10.3284 9 9.5H8C8 9.77614 7.77614 10 7.5 10V11ZM10 6V11H11V6H10ZM10.5 7H13V6H10.5V7ZM10.5 9H12V8H10.5V9ZM2 5V1.5H1V5H2ZM13 3.5V5H14V3.5H13ZM2.5 1H10.5V0H2.5V1ZM10.1464 0.853553L13.1464 3.85355L13.8536 3.14645L10.8536 0.146447L10.1464 0.853553ZM2 1.5C2 1.22386 2.22386 1 2.5 1V0C1.67157 0 1 0.671573 1 1.5H2ZM1 12V13.5H2V12H1ZM2.5 15H12.5V14H2.5V15ZM14 13.5V12H13V13.5H14ZM12.5 15C13.3284 15 14 14.3284 14 13.5H13C13 13.7761 12.7761 14 12.5 14V15ZM1 13.5C1 14.3284 1.67157 15 2.5 15V14C2.22386 14 2 13.7761 2 13.5H1Z"
                        fill="#fff"
                      />
                    </svg>
                    Download Brochure
                  </button>
                </div>
                <div className="content_bottom">
                  <div className="row">
                    <div className="block">
                      <div className="label">Property type</div>
                      <div className="text">Apartment</div>
                    </div>
                    <div className="block">
                      <div className="label">Unit type</div>
                      <div className="text">Studios, 1, 2, 3 BR</div>
                    </div>
                    <div className="block">
                      <div className="label">Size</div>
                      <div className="text">423 to 1,301 SQ FT. </div>
                    </div>
                    <div className="block">
                      <div className="label">Down Payment</div>
                      <div className="text"> 70% </div>
                    </div>
                    <div className="block">
                      <div className="label">Payment Plan:</div>
                      <div className="text"> 70/30 </div>
                    </div>
                    <div className="block">
                      <div className="label">Handover</div>
                      <div className="text"> Q2- 2027</div>
                    </div>
                  </div>
                  <div className="price">
                    <p>
                      <span>Starting From</span>
                      AED 999K /-
                    </p>
                  </div>
                </div>
              </div>
              <div className="content">
                <h3 className="title">Description</h3>
                <ReadMoreText text={about} maxLength={400} />
              </div>
              <div className="content">
                <h3 className="title">Location Advantages</h3>
                <ReadMoreText text={about} maxLength={400} />
              </div>
              <div className="content">
                <h3 className="title">Amenities</h3>
                <div className="amenity_row">
                  <div className="amenity">
                    <FireExtinguisher size={20} />
                    <h4>Smoke alarm</h4>
                  </div>
                  <div className="amenity">
                    <FireExtinguisher size={20} />
                    <h4>Smoke alarm</h4>
                  </div>
                  <div className="amenity">
                    <FireExtinguisher size={20} />
                    <h4>Smoke alarm</h4>
                  </div>
                  <div className="amenity">
                    <FireExtinguisher size={20} />
                    <h4>Smoke alarm</h4>
                  </div>
                  <div className="amenity">
                    <FireExtinguisher size={20} />
                    <h4>Smoke alarm</h4>
                  </div>
                  <div className="amenity">
                    <FireExtinguisher size={20} />
                    <h4>Smoke alarm</h4>
                  </div>
                  <div className="amenity">
                    <FireExtinguisher size={20} />
                    <h4>Smoke alarm</h4>
                  </div>
                </div>
              </div>
              <div className="content">
                <h3 className="title">Pricing</h3>
                <Table
                  columns={floorPlanColumns}
                  size={"middle"}
                  tableLayout={"fixed"}
                />
              </div>
              <div className="content">
                <h3 className="title">Payment Plan</h3>
                <div className="payment_plan_row">
                  <div className="block">
                    <div className="icon">
                      <Image
                        src={"/assets/images/down-payment.png"}
                        width={40}
                        height={40}
                        alt="icon"
                      />
                    </div>
                    <h4 className="percent">20%</h4>
                    <div className="name">Down Payment</div>
                    <div className="time">On Booking Date</div>
                  </div>
                  <div className="block">
                    <div className="icon">
                      <Image
                        src={"/assets/images/under-construction.png"}
                        width={40}
                        height={40}
                        alt="icon"
                      />
                    </div>
                    <div className="percent">50%</div>
                    <div className="name">During Construction</div>
                    <div className="time">Easy Installments</div>
                  </div>
                  <div className="block">
                    <div className="icon">
                      <Image
                        src={"/assets/images/hand-over.png"}
                        width={40}
                        height={40}
                        alt="icon"
                      />
                    </div>
                    <div className="percent">30%</div>
                    <div className="name">On Handover</div>
                    <div className="time">100% Completion</div>
                  </div>
                </div>
              </div>
              <div className="content">
                <h3 className="title">Floor Plans</h3>
                <Table
                  columns={floorPlanColumns}
                  size={"middle"}
                  tableLayout={"fixed"}
                />
              </div>
              <div className="content">
                <h3 className="title">Frequently Asked Questions</h3>
                <Collapse items={items} defaultActiveKey={["1"]} />
              </div>
            </div>
            <div className="contact_form">
              <h4 className="title">Contact Our Experts</h4>
              <form>
                <div className="form_field">
                  <label>Full Name</label>
                  <input placeholder="Full Name" />
                </div>
                <div className="form_field">
                  <label>Full Name</label>
                  <input placeholder="Email Id" />
                </div>
                <div className="form_field">
                  <label>Phone Number</label>
                  <input placeholder="Email Id" />
                </div>
                <div className="form_field">
                  <label>Message</label>
                  <textarea placeholder="Message"></textarea>
                </div>
                <button className="submit">Contact Now!</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

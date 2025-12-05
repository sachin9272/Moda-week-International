const ServiceCard = ({ img, title, desc }) => (
  <div className=" border-amber-800" style={{border:'2px solid #E5E7EB'}}>
    <div className="w-full h-64 overflow-hidden">
      <img
        src={img}
        alt={title}
        className="w-full h-full object-cover object-top"
      />
    </div>
    <div className="p-6">
      <p className="mt-3 font-semibold">{title}</p>
      <p className="text-sm mt-2 text-gray-600">{desc}</p>
    </div>
  </div>
);

export default ServiceCard;

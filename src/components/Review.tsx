const Review: React.FC = () => {
  return (
    <section className="flex flex-col items-center justify-center py-16 lg:py-24 bg-gray-50">
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-center">
        See What Others Say About Us!
      </h2>
      <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
        <div className="w-full max-w-xs flex flex-col items-center justify-center p-4 bg-white shadow rounded-md h-[400px]">
          <h3 className="text-xl text-center p-1">Dhanesh Nedumaran</h3>
          <img
            src="./man1.png"
            className="h-20 w-20 bg-blue-600 my-2 rounded-full p-1"
          />
          <p className="p-1">⭐⭐⭐⭐⭐</p>
          <p className="text-center p-1">good and peaceful location.. with  parking facility..<br/>Food is fine and  homely.. and the rates are  affordable.</p>
        </div>

        <div className="w-full max-w-xs flex flex-col items-center justify-center p-4 bg-white shadow rounded-md h-[400px]">
          <h3 className="text-xl text-center p-1">Kumar</h3>
          <img
            src="./man2.png"
            className="h-20 w-20 bg-blue-600 my-2 rounded-full p-1"
          />
          <p className="p-1">⭐⭐⭐⭐⭐</p>
          <p className="text-center p-1">I've been Staying for 1 year and this is the best PG in this Surrounding and I really like the food, it's like my home food and I like also like this environment</p>
        </div>

        <div className="w-full max-w-xs flex flex-col items-center justify-center p-4 bg-white shadow rounded-md [400px]">
          <h3 className="text-xl text-center p-1">Ed Veen</h3>
          <img
            src="./man3.png"
            className="h-20 w-20 bg-blue-600 my-2 rounded-full p-1"
          />
          <p className="p-1">⭐⭐⭐⭐⭐</p>
          <p className="text-center p-1">I've been Staying for 1 year and this is the best PG in this Surrounding and I really like the food, it's like my home food and also the management is very Friendly and caring with all the residents. This is the best environmental Pg in this surrounding</p>
        </div>
      </div>
    </section>
  );
};
export default Review;

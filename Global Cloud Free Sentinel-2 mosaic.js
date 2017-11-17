//__author__ = "Petr Sevcik"
//__copyright__ = "Petr Sevcik as S.cartography"
//__credits__ = ["Petr Sevcik"]
//__license__ = "GPL"
//__version__ = "1.0"
//__maintainer__ = "Petr Sevcik"
//__email__ = "sevcik.cartography@gmail.com"
//__status__ = "Alpha"



//Select all Sentinel-2 products from spring/summer of 2016 and 2017, just visible bands (B2,B3,B4) to optimize speed
var collection2016 = ee.ImageCollection('COPERNICUS/S2')
     .select(['B4', 'B3', 'B2'])
    .filterDate('2016-06-01', '2016-09-30')
    .sort('CLOUDY_PIXEL_PERCENTAGE', false)
    //.filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'less_than', 5.0)    
    //.filterBounds(geometry)
    ;

var collection2017 = ee.ImageCollection('COPERNICUS/S2')
    .select(['B4', 'B3', 'B2'])
    .filterDate('2017-06-01', '2017-09-30')
    .sort('CLOUDY_PIXEL_PERCENTAGE', false)
    //.filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'less_than', 5.0)
    //.filterMetadata('system:visualization_0_max:', 'less_than', 1500)
    //  .filterBounds(geometry)
    ;


//Clip the all histogram values values to the mean and define min and max Percentiles of the histogramm, i. e.: remove cloud and cloud shadows via histogramm values
var collect2016 = ee.ImageCollection(collection2016.reduce(ee.Reducer.intervalMean(5, 10)));
var collect2017 = ee.ImageCollection(collection2017.reduce(ee.Reducer.intervalMean(5, 10)));


//Merge the 2016 and 2017 datasets into one seemless mosaic
var collect=  ee.ImageCollection(collect2016.merge(collect2017))
.mosaic();




// Display the Results

//Center the World canvas
Map.setCenter(0.0,0.0, 3);

//Add the mosaic layer as a RGB composite with RGB values streching from 'min' to 'max'
Map.addLayer(collect, {bands: ['B4_mean', 'B3_mean', 'B2_mean'], min:[250,  280, 600], max: [2250, 2300, 2600]}, 'TOA composite cloudfree 2016 and 2017')



export const fetchReliefWebReports = async (params = {}) => {
    const baseUrl = 'https://api.reliefweb.int/v1/disasters';
    const url = new URL(baseUrl);
  
    url.searchParams.append('appname', 'SafeRoute-App');
    url.searchParams.append('preset', 'latest');
    url.searchParams.append('limit', '50');
    url.searchParams.append('sort', 'date:desc');
  
    const currentDate = new Date();
    const firstOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const dateString = firstOfMonth.toISOString().replace(/\.\d{3}Z$/, '+00:00'); // "2025-04-01T00:00:00+00:00"
    url.searchParams.append('filter[operator]', 'AND');
    url.searchParams.append('filter[conditions][0][field]', 'date.created');
    url.searchParams.append('filter[conditions][0][value][from]', dateString);
  
    // Filter for disaster types (Flood or Earthquake)
    url.searchParams.append('filter[conditions][1][operator]', 'OR');
    url.searchParams.append('filter[conditions][1][conditions][0][field]', 'type.code');
    url.searchParams.append('filter[conditions][1][conditions][0][value]', 'FL'); // Flood
    url.searchParams.append('filter[conditions][1][conditions][1][field]', 'type.code');
    url.searchParams.append('filter[conditions][1][conditions][1][value]', 'EQ'); // Earthquake
  
    // Request valid fields
    const includeFields = [
      'name',
      'date.created',
      'primary_country',
      'country',
      'type',
      'description',
      'profile'
    ];
    includeFields.forEach(field => {
      url.searchParams.append('fields[include][]', field);
    });
  
    try {
      console.log('Fetching ReliefWeb URL:', url.toString());
      const response = await fetch(url.toString());
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
      }
      const data = await response.json();
      if (!data?.data) {
        throw new Error('Invalid API response structure');
      }
  
      console.log('ReliefWeb API Response (raw):', data.data);
  
      // Log coordinate fields
      data.data.forEach(report => {
        console.log('Report coordinate fields:', {
          id: report.id,
          primary_country: report.fields.primary_country,
          country: report.fields.country,
          profile: report.fields.profile,
          fields: Object.keys(report.fields)
        });
        if (!report.fields.primary_country?.location && !report.fields.profile?.overview_map) {
          console.warn('Report missing coordinate fields:', report);
        }
      });
  
      // Map reports and fetch centroids if needed
      const reports = await Promise.all(
        data.data.map(async report => {
          // Skip reports with "March" in title
          if (report.fields.name?.toLowerCase().includes('mar')) {
            return null;
          }
  
          let coordinates = null;
          if (report.fields.primary_country?.location) {
            coordinates = [report.fields.primary_country.location.lon, report.fields.primary_country.location.lat];
          } else if (report.fields.profile?.overview_map) {
            coordinates = [report.fields.profile.overview_map.lon, report.fields.profile.overview_map.lat];
          } else if (report.fields.primary_country?.iso3) {
            // Fetch country centroid
            try {
              const countryResponse = await fetch(
                `https://api.reliefweb.int/v1/countries?filter[field]=iso3&filter[value]=${report.fields.primary_country.iso3}&fields[include][]=location`
              );
              const countryData = await countryResponse.json();
              if (countryData?.data?.[0]?.fields?.location) {
                coordinates = [countryData.data[0].fields.location.lon, countryData.data[0].fields.location.lat];
              }
            } catch (error) {
              console.warn(`Failed to fetch centroid for ${report.fields.primary_country?.name}:`, error);
            }
          }
  
          return {
            id: report.id,
            title: report.fields.name || report.fields.title || 'Unnamed Disaster',
            body: report.fields.description || '',
            date: report.fields.date?.created || new Date().toISOString(),
            type: report.fields.primary_type?.name || report.fields.type?.[0]?.name || 'Unknown',
            country: report.fields.primary_country?.name || report.fields.country?.[0]?.name || 'Unknown',
            coordinates,
            url: report.fields.url_alias || `https://reliefweb.int/disaster/${report.id}`
          };
        })
      );
  
      return reports.filter(report => report !== null);
    } catch (error) {
      console.error('ReliefWeb API Error:', error);
      return [];
    }
  };
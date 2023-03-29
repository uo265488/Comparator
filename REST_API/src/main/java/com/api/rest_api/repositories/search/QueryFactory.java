package com.api.rest_api.repositories.search;


import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QueryFactory {

    /**
     * Performs a filterQuery for the field "fieldName" and the value "value"
     * @param fieldName
     * @return list of hits
     */
    Query getFilterQuery(String fieldName, String value);

    /**
     * Performs a rangeQuery for the field "fieldName" in the range
     * @param fieldName
     * @return list of hits
     */
    Query getRangeQuery(String fieldName, double min, double max);

    /**
     * Creates the must query
     * @return
     */
    Query getBoolQuery(List<Query> queries);

    /**
     * Creates a matchall query
     */
    Query getMatchAllQuery();

    /**
     * Creates a must query combining all the filters
     * @param filters
     * @return
     */
    Query getMustQuery(List<Query> filters);

    /**
     * Creates a terms query
     *
     * @param field
     * @param value
     * @return Query
     */
    Query getTermsQuery(String field, Object value);
}

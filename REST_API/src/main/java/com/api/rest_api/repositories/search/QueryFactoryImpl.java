package com.api.rest_api.repositories.search;

import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.json.JsonData;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class QueryFactoryImpl implements QueryFactory {

    @Override
    public Query getFilterQuery(String fieldName, String value) {
        return MatchQuery.of(m -> m
                .field(fieldName)
                .query(value)
        )._toQuery();
    }

    @Override
    public Query getRangeQuery(String fieldName, double min, double max) {
        return RangeQuery.of(r -> r
                .field(fieldName)
                .lte(JsonData.of(max))
                .gte(JsonData.of(min))
        )._toQuery();
    }

    @Override
    public Query getBoolQuery(List<Query> queries) {
        return BoolQuery.of(b -> b.filter(queries))._toQuery();
    }

    @Override
    public Query getMatchAllQuery() {
        return MatchAllQuery.of(q -> q)._toQuery();
    }

    @Override
    public Query getMustQuery(List<Query> queryList) {
        return BoolQuery.of(b -> b.must(queryList))._toQuery();
    }

    @Override
    public Query getTermsQuery(String field, Object value) {
        Query termQuery = TermQuery.of(t -> t
                .value(value.toString())
                .field(field))._toQuery();
        return termQuery;
    }
}

import pickle
from recommender import content_based_recommendation,user_based_recommendation
from surprise import Dataset, Reader

with open("ratings.pkl",'rb') as file:
    ratings_df=pickle.load(file)
with open("model.pkl",'rb') as file:
    model=pickle.load(file)
data=pickle.load(open('database.pkl','rb'))

user_history=[296,72998,]
all_movie_ids = set(ratings_df['id'].unique())
movie_id=user_history[0]
content_based_recommendations=content_based_recommendation(movie_id, data)
print(content_based_recommendations)

reader = Reader(rating_scale=(1, 5)) # Assuming ratings are from 1 to 5
data = Dataset.load_from_df(ratings_df[['userId', 'id', 'rating']], reader)
trainset = data.build_full_trainset()
raw_to_inner_iid_map = {}
inner_to_raw_iid_map = {}

for inner_id in trainset.all_items():
    raw_id = trainset.to_raw_iid(inner_id)
    raw_to_inner_iid_map[raw_id] = inner_id
    inner_to_raw_iid_map[inner_id] = raw_id

movie_factors = {}
for movie_raw_id in all_movie_ids:
    if movie_raw_id in raw_to_inner_iid_map:
        movie_inner_id = raw_to_inner_iid_map[movie_raw_id]
        movie_factors[movie_raw_id] = model.qi[movie_inner_id]

user_based_recommendations=user_based_recommendation(user_history,model,all_movie_ids,movie_factors,raw_to_inner_iid_map,top_n=5)
print(user_based_recommendations)
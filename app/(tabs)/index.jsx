import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Link, useRouter } from "expo-router";
import services from "../../utils/services/services";
import Colors from "../../utils/Colors";
import Header from "../components/Header";
import PieChart from "react-native-pie-chart";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  collection,
  getDoc,
  limit,
  onSnapshot,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db } from "../../utils/FirebaseConfig";
import CategoryList from "../components/CategoryList";

function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const widthAndHeight = 140;
  const [values, setValues] = useState([1]);
  const [slicesColor, setSliceColor] = useState([Colors.black]);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUserData = async () => {
    const logged = await services.getData("login");
    const docRef = doc(db, "users", logged);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUser(docSnap.data());
      setEmail(logged);
    } else {
      setUser(null);
      setEmail(null);
    }
  };

  const checkUserAuth = async () => {
    const logged = await services.getData("login");

    if (!logged) {
      router.replace("/login");
    }
  };

  const calculateTotalCost = () => {
    let totalCost = 0;

    if (categories) {
      categories.forEach((category) => {
        totalCost += calculateCategoryTotalCost(category);
      });
      setTotalCost(totalCost);
    }
  };
  const calculateCategoryTotalCost = (category) => {
    let totalCost = 0;
    category.items.forEach((i) => {
      totalCost += parseFloat(i.cost);
    });
    return totalCost;
  };
  const computePieChartData = () => {
    let values = [Colors.black];
    let slicesColor = [1];

    if (categories) {
      categories.forEach((category) => {
        let totalCost = 0;
        category.items.map((i) => {
          totalCost += parseFloat(i.cost);
        });
        values.push(totalCost);
        slicesColor.push(category.color);
      });

      setValues(values);
      setSliceColor(slicesColor);
    }
  };

  useEffect(() => {
    calculateTotalCost();
    computePieChartData();
  }, [categories]);

  useEffect(() => {
    checkUserAuth().then(() => {
      getUserData();
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const catRef = collection(db, "category");
    const q = query(catRef, where("createdBy", "==", email), limit(5));

    const unSub = onSnapshot(q, (querySnapshot) => {
      const categories = [];

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          categories.push(doc.data());
        });
      }
      categories.sort((a, b) => {
        let aTotalCost = calculateCategoryTotalCost(a);
        let bTotalCost = calculateCategoryTotalCost(b);
        return bTotalCost - aTotalCost;
      });
      setCategories(categories);
      setLoading(false);
    });

    return () => {
      unSub();
    };
  }, [email]);

  const onRefresh = () => {
    getUserData();
  };

  return (
    <ScrollView
      style={{
        backgroundColor: Colors.lightgrey,
      }}
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={loading} />
      }
    >
      <View style={styles.headerContainer}>
        <Header user={user} />
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Total estimate : {totalCost}€</Text>
          <View style={styles.subContainer}>
            <PieChart
              style={{ flex: 1 }}
              widthAndHeight={widthAndHeight}
              series={values}
              sliceColor={slicesColor}
              coverRadius={0.7}
              coverFill={"#FFF"}
            />
            <View style={{ flex: 1 }}>
              {categories?.map((c) => (
                <View style={styles.legendTitle} key={c.id}>
                  <MaterialCommunityIcons
                    name="checkbox-blank-circle"
                    size={24}
                    color={c.color}
                  />
                  <Text>{c.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Link
          href={{
            pathname: "/add-new-category",
            params: { email: user?.email },
          }}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={48} color={Colors.primary} />
        </Link>
      </View>
      <View>
        {loading ? (
          <View style={{ padding: 24 }}>
            <Text style={styles.title}>Loading data...</Text>
          </View>
        ) : (
          <CategoryList title={"Latest budget"} categories={categories} />
        )}
      </View>
    </ScrollView>
  );
}

export default Home;

const styles = StyleSheet.create({
  legendTitle: {
    display: "flex",
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    gap: 8,
    fontFamily: "Rubik-Regular",
  },
  headerContainer: {
    marginTop: 24,
    padding: 24,
    backgroundColor: Colors.primary,
    height: 150,
  },
  subContainer: {
    marginTop: 8,
    display: "flex",
    flexDirection: "row",
    gap: 24,
  },
  button: {
    padding: 16,
    borderRadius: 32,
    marginTop: 100,
    backgroundColor: Colors.white,
  },
  buttonText: {
    textAlign: "center",
    color: Colors.primary,
  },
  title: {
    fontSize: 24,
    fontFamily: "Rubik-Bold",
    marginBottom: 16,
  },
  card: {
    marginTop: -80,
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 16,
    elevation: 1,
  },
  cardContainer: {
    padding: 24,
  },
  addButton: {
    position: "absolute",
    bottom: -64,
    right: 16,
    zIndex: 1,
  },
});

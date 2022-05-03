import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  typographyClasses,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAlert from "../hooks/useAlert";
import api from "../services/api";
import { AxiosError } from "axios";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  Category,
  Discipline,
  TeacherDisciplines,
  Test,
  TestByDiscipline,
} from "../services/api";
const styles = {
  container: {
    marginTop: "180px",
    width: "460px",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  title: { marginBottom: "30px" },
  dividerContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "16px",
    marginBottom: "26px",
  },
  input: { marginBottom: "16px" },
  actionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};
interface FormData {
  testTitle: string;
  testPDF: string;
  category: string;
  discipline: string;
  teacherDiscipline: string;
}
export default function Add() {
  const navigate = useNavigate();
  const { setMessage } = useAlert();
  const { token } = useAuth();
  const [terms, setTerms] = useState<TestByDiscipline[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState<FormData>({
    testTitle: "",
    testPDF: "",
    category: "",
    discipline: "",
    teacherDiscipline: "",
  });
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    async function loadPage() {
      if (!token) return;

      const { data: testsData } = await api.getTestsByDiscipline(token);
      setTerms(testsData.tests);
      const { data: categoriesData } = await api.getCategories(token);
      setCategories(categoriesData.categories);
    }
    loadPage();
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (
      !formData?.testTitle ||
      !formData?.testPDF ||
      !formData?.category ||
      !formData?.discipline ||
      !formData?.teacherDiscipline
    ) {
      setMessage({ type: "error", text: "Todos os campos são obrigatórios!" });
      return;
    }

    try {
      // await api.signUp({ email, password });
      setMessage({ type: "success", text: "Cadastro efetuado com sucesso!" });
      navigate("/login");
    } catch (error: Error | AxiosError | any) {
      if (error.response) {
        setMessage({
          type: "error",
          text: error.response.data,
        });
        return;
      }
      setMessage({
        type: "error",
        text: "Erro, tente novamente em alguns segundos!",
      });
    }
  }
  console.log(terms);
  const disciplines = terms[0].disciplines;
  return (
    <>
      <Typography
        sx={{ fontWeight: "500", fontSize: "24px", alignSelf: "center" }}
      >
        Adicione uma prova
      </Typography>
      ;
      <Divider sx={{ marginBottom: "35px" }} />
      <Box
        sx={{
          marginX: "auto",
          width: "700px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/app/disciplinas")}
          >
            Disciplinas
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/app/pessoas-instrutoras")}
          >
            Pessoa Instrutora
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/app/adicionar")}
          >
            Adicionar
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          marginX: "auto",
          width: "700px",
          display: "flex",
          flexDirection: "column",
          marginTop: "70px;",
        }}
      >
        <TextField
          name="testTitle"
          sx={styles.input}
          label="Título da prova"
          type="text"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.testTitle}
        />
        <TextField
          name="testPDF"
          sx={styles.input}
          label="PDF da prova"
          type="text"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.testPDF}
        />
        <SelectInputs props={categories} type="Categoria" />
        <SelectInputs props={disciplines} type="Disciplina" />
        <Button
          sx={{ height: "45px" }}
          variant="contained"
          onClick={() => navigate("/app/adicionar")}
        >
          Enviar
        </Button>
      </Box>
    </>
  );
}

interface SelectProps {
  props: Category[] | Discipline[];
  type: string;
}

function SelectInputs({ props, type }: SelectProps) {
  const [inputData, setInputData] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setInputData(event.target.value as string);
  };
  return (
    <FormControl>
      <InputLabel id={`select-label-${type}`}>{type}</InputLabel>
      <Select
        id={`select-label-${type}`}
        sx={{ marginBottom: "14px" }}
        placeholder={type}
        label={type}
        value={inputData}
        onChange={handleChange}
      >
        {props.map((element) => {
          console.log(element);
          return <MenuItem value={element.name}>{element.name}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
}

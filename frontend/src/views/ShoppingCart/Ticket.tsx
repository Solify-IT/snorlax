import React from 'react';
import {
  PDFDownloadLink, Page, Text, View, Document,
} from '@react-pdf/renderer';

interface Props {
  ticketData: { libraryName: string, books: any, total: number, state:string,
    celular:string, correo:string, ciudad:string, nombre:string, fecha:string };
}

const ReportDocument: React.FC<Props> = ({ ticketData }) => (
  <Document>
    <Page size="A4">
      <View style={{ display: 'flex', flexDirection: 'column', padding: '10px' }}>
        <View style={{ textAlign: 'center', marginTop: 8, marginBottom: 8 }} />
        <View style={{ textAlign: 'center', marginTop: 8, marginBottom: 8 }}>
          <Text>{ticketData.state}</Text>
        </View>
        <View style={{ textAlign: 'center', marginTop: 8, marginBottom: 8 }}>
          <Text>{ticketData.ciudad}</Text>
        </View>
        <View style={{ textAlign: 'center', marginTop: 8, marginBottom: 8 }}>
          <Text>{ticketData.correo}</Text>
        </View>
        <View style={{ textAlign: 'center', marginTop: 8, marginBottom: 8 }}>
          <Text>{ticketData.celular}</Text>
        </View>
        <View style={{ textAlign: 'center', marginTop: 8, marginBottom: 8 }}>
          <Text>{ticketData.fecha}</Text>
        </View>

        <View style={{
          width: '100%', border: '1px solid black', display: 'flex', flexDirection: 'column',
        }}
        >
          <View style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
            <View style={{ width: '42.5%', textAlign: 'center', border: '1px solid black' }}><Text>Nombre</Text></View>
            <View style={{ width: '15%', textAlign: 'center', border: '1px solid black' }}><Text>Cantidad</Text></View>
            <View style={{ width: '42.5%', textAlign: 'center', border: '1px solid black' }}><Text>Precio</Text></View>
          </View>
          {ticketData.books.map((book: any) => (
            <View style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
              <View style={{ width: '42.5%', textAlign: 'center', border: '1px solid black' }}><Text>{book.book.title}</Text></View>
              <View style={{ width: '15%', textAlign: 'center', border: '1px solid black' }}><Text>{book.amount}</Text></View>
              <View style={{ width: '42.5%', textAlign: 'center', border: '1px solid black' }}>
                <Text>
                  $
                  {book.book.price}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View>
          <Text style={{ paddingTop: '10px', fontSize: '25px' }}>
            Total: $
            {ticketData.total}
          </Text>
        </View>
        <View style={{ textAlign: 'center', marginTop: 16, marginBottom: 16 }}>
          <Text>
            Atendio:
            {ticketData.nombre}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

// Create Document Component
const Ticket: React.FC<Props> = ({
  ticketData,
}) => (
  <div>
    <PDFDownloadLink document={<ReportDocument ticketData={ticketData} />} fileName="ticket.pdf">
      Descargar Ticket
    </PDFDownloadLink>
    <ReportDocument ticketData={ticketData} />
  </div>
);

export default Ticket;
